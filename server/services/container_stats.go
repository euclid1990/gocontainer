package services

import (
	"context"
	"encoding/json"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/cli/command/formatter"
	"github.com/docker/docker/client"
	"strings"
	"sync"
)

type stats struct {
	ostype string
	mu     sync.Mutex
	cs     []*formatter.ContainerStats
}

func (s *stats) add(cs *formatter.ContainerStats) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.isKnownContainer(cs.Container); !exists {
		s.cs = append(s.cs, cs)
		return true
	}
	return false
}

func (s *stats) remove(id string) {
	s.mu.Lock()
	if i, exists := s.isKnownContainer(id); exists {
		s.cs = append(s.cs[:i], s.cs[i+1:]...)
	}
	s.mu.Unlock()
}

func (s *stats) isKnownContainer(cid string) (int, bool) {
	for i, c := range s.cs {
		if c.Container == cid {
			return i, true
		}
	}
	return -1, false
}

func calculateCPUPercentUnix(previousCPU, previousSystem uint64, v *types.StatsJSON) float64 {
	var (
		cpuPercent = 0.0
		// calculate the change for the cpu usage of the container in between readings
		cpuDelta = float64(v.CPUStats.CPUUsage.TotalUsage) - float64(previousCPU)
		// calculate the change for the entire system between readings
		systemDelta = float64(v.CPUStats.SystemUsage) - float64(previousSystem)
		onlineCPUs  = float64(v.CPUStats.OnlineCPUs)
	)

	if onlineCPUs == 0.0 {
		onlineCPUs = float64(len(v.CPUStats.CPUUsage.PercpuUsage))
	}
	if systemDelta > 0.0 && cpuDelta > 0.0 {
		cpuPercent = (cpuDelta / systemDelta) * onlineCPUs * 100.0
	}
	return cpuPercent
}

func calculateCPUPercentWindows(v *types.StatsJSON) float64 {
	// Max number of 100ns intervals between the previous time read and now
	possIntervals := uint64(v.Read.Sub(v.PreRead).Nanoseconds()) // Start with number of ns intervals
	possIntervals /= 100                                         // Convert to number of 100ns intervals
	possIntervals *= uint64(v.NumProcs)                          // Multiple by the number of processors

	// Intervals used
	intervalsUsed := v.CPUStats.CPUUsage.TotalUsage - v.PreCPUStats.CPUUsage.TotalUsage

	// Percentage avoiding divide-by-zero
	if possIntervals > 0 {
		return float64(intervalsUsed) / float64(possIntervals) * 100.0
	}
	return 0.00
}

func calculateBlockIO(blkio types.BlkioStats) (blkRead uint64, blkWrite uint64) {
	for _, bioEntry := range blkio.IoServiceBytesRecursive {
		switch strings.ToLower(bioEntry.Op) {
		case "read":
			blkRead = blkRead + bioEntry.Value
		case "write":
			blkWrite = blkWrite + bioEntry.Value
		}
	}
	return
}

func calculateNetwork(network map[string]types.NetworkStats) (float64, float64) {
	var rx, tx float64

	for _, v := range network {
		rx += float64(v.RxBytes)
		tx += float64(v.TxBytes)
	}
	return rx, tx
}

func collect(cli *client.Client, ctx context.Context, s *formatter.ContainerStats, streamStats bool, waitFirst *sync.WaitGroup) {
	defer waitFirst.Done()

	var (
		previousCPU    uint64
		previousSystem uint64
	)

	response, err := cli.ContainerStats(ctx, s.Container, streamStats)
	defer response.Body.Close()
	if err != nil {
		s.SetError(err)
		return
	}

	var (
		v                      *types.StatsJSON
		memPercent, cpuPercent float64
		blkRead, blkWrite      uint64 // Only used on Linux
		mem, memLimit, memPerc float64
		pidsStatsCurrent       uint64
	)

	dec := json.NewDecoder(response.Body)
	if err := dec.Decode(&v); err != nil {
		s.SetError(err)
		return
	}

	daemonOSType = response.OSType

	if daemonOSType != "windows" {
		// MemoryStats.Limit will never be 0 unless the container is not running and we haven't
		// got any data from cgroup
		if v.MemoryStats.Limit != 0 {
			memPercent = float64(v.MemoryStats.Usage) / float64(v.MemoryStats.Limit) * 100.0
		}
		previousCPU = v.PreCPUStats.CPUUsage.TotalUsage
		previousSystem = v.PreCPUStats.SystemUsage
		cpuPercent = calculateCPUPercentUnix(previousCPU, previousSystem, v)
		blkRead, blkWrite = calculateBlockIO(v.BlkioStats)
		mem = float64(v.MemoryStats.Usage)
		memLimit = float64(v.MemoryStats.Limit)
		memPerc = memPercent
		pidsStatsCurrent = v.PidsStats.Current
	} else {
		cpuPercent = calculateCPUPercentWindows(v)
		blkRead = v.StorageStats.ReadSizeBytes
		blkWrite = v.StorageStats.WriteSizeBytes
		mem = float64(v.MemoryStats.PrivateWorkingSet)
	}
	netRx, netTx := calculateNetwork(v.Networks)
	s.SetStatistics(formatter.StatsEntry{
		Name:             v.Name,
		ID:               v.ID,
		CPUPercentage:    cpuPercent,
		Memory:           mem,
		MemoryPercentage: memPerc,
		MemoryLimit:      memLimit,
		NetworkRx:        netRx,
		NetworkTx:        netTx,
		BlockRead:        float64(blkRead),
		BlockWrite:       float64(blkWrite),
		PidsCurrent:      pidsStatsCurrent,
	})
}
