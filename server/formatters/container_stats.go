package formatters

import (
	"fmt"
	"github.com/docker/docker/cli/command/formatter"
	units "github.com/docker/go-units"
)

const (
	winOSType = "windows"
)

type Stats struct {
	Container string `json:"container_id"`
	Name      string `json:"container_name"`
	CPUPerc   string `json:"cpu_perc"`
	MemUsage  string `json:"mem_usage"`
	MemPerc   string `json:"mem_perc"`
	NetIO     string `json:"net_io"`
	BlockIO   string `json:"block_io"`
	PIDs      string `json:"pids"`
}

func GetListContainerStats(osType string, cs []*formatter.ContainerStats) []Stats {
	var result []Stats
	for _, c := range cs {
		containerStatsCtx := &containerStatsContext{
			s:  c.GetStatistics(),
			os: osType,
		}
		stats := Stats{
			Container: containerStatsCtx.Container(),
			Name:      containerStatsCtx.Name(),
			CPUPerc:   containerStatsCtx.CPUPerc(),
			MemUsage:  containerStatsCtx.MemUsage(),
			MemPerc:   containerStatsCtx.MemPerc(),
			NetIO:     containerStatsCtx.NetIO(),
			BlockIO:   containerStatsCtx.BlockIO(),
			PIDs:      containerStatsCtx.PIDs(),
		}
		result = append(result, stats)
	}
	return result
}

type containerStatsContext struct {
	s  formatter.StatsEntry
	os string
}

func (c *containerStatsContext) Container() string {
	return c.s.Container
}

func (c *containerStatsContext) Name() string {
	if len(c.s.Name) > 1 {
		return c.s.Name[1:]
	}
	return "--"
}

func (c *containerStatsContext) ID() string {
	return c.s.ID
}

func (c *containerStatsContext) CPUPerc() string {
	if c.s.IsInvalid {
		return fmt.Sprintf("--")
	}
	return fmt.Sprintf("%.2f%%", c.s.CPUPercentage)
}

func (c *containerStatsContext) MemUsage() string {
	if c.s.IsInvalid {
		return fmt.Sprintf("-- / --")
	}
	if c.os == winOSType {
		return fmt.Sprintf("%s", units.BytesSize(c.s.Memory))
	}
	return fmt.Sprintf("%s / %s", units.BytesSize(c.s.Memory), units.BytesSize(c.s.MemoryLimit))
}

func (c *containerStatsContext) MemPerc() string {
	if c.s.IsInvalid || c.os == winOSType {
		return fmt.Sprintf("--")
	}
	return fmt.Sprintf("%.2f%%", c.s.MemoryPercentage)
}

func (c *containerStatsContext) NetIO() string {
	if c.s.IsInvalid {
		return fmt.Sprintf("--")
	}
	return fmt.Sprintf("%s / %s", units.HumanSizeWithPrecision(c.s.NetworkRx, 3), units.HumanSizeWithPrecision(c.s.NetworkTx, 3))
}

func (c *containerStatsContext) BlockIO() string {
	if c.s.IsInvalid {
		return fmt.Sprintf("--")
	}
	return fmt.Sprintf("%s / %s", units.HumanSizeWithPrecision(c.s.BlockRead, 3), units.HumanSizeWithPrecision(c.s.BlockWrite, 3))
}

func (c *containerStatsContext) PIDs() string {
	if c.s.IsInvalid || c.os == winOSType {
		return fmt.Sprintf("--")
	}
	return fmt.Sprintf("%d", c.s.PidsCurrent)
}
