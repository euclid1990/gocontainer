package services

import (
	"../formatters"
	"context"
	"encoding/json"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/events"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/cli/command"
	"github.com/docker/docker/cli/command/formatter"
	"github.com/docker/docker/client"
	"log"

	"sync"
)

type statsOptions struct {
	all        bool
	noStream   bool
	format     string
	containers []string
}

var (
	daemonOSType string
	opts         statsOptions
)

// Create new stat options
func newStatsOptions() statsOptions {
	var opts statsOptions
	opts.all = true
	opts.noStream = true
	opts.format = ""
	return opts
}

// Watches for container creation and removal
func monitorContainerEvents(dockerCli *client.Client, dockerCtx context.Context, started chan<- struct{}, c chan events.Message, closeChan chan error) {
	f := filters.NewArgs()
	f.Add("type", "container")
	options := types.EventsOptions{
		Filters: f,
	}
	eventq, errq := dockerCli.Events(dockerCtx, options)
	// Whether we successfully subscribed to eventq or not, we can now
	// unblock the main goroutine.
	close(started)
	for {
		select {
		case event := <-eventq:
			c <- event
		case err := <-errq:
			closeChan <- err
			return
		}
	}
}

// Monitor all events of containers
func monitorEvents(dockerCli *client.Client, dockerCtx context.Context, started chan<- struct{}, eMsg chan events.Message, closeChan chan error) {
	eh := command.InitEventHandler()
	eh.Handle("create", func(e events.Message) {
		evt, _ := json.MarshalIndent(e, "", " ")
		log.Println(string(evt))
	})
	eh.Handle("start", func(e events.Message) {
		evt, _ := json.MarshalIndent(e, "", " ")
		log.Println(string(evt))
	})
	eh.Handle("die", func(e events.Message) {
		evt, _ := json.MarshalIndent(e, "", " ")
		log.Println(string(evt))
	})
	go eh.Watch(eMsg)
	go monitorContainerEvents(dockerCli, dockerCtx, started, eMsg, closeChan)
	/* Pending Code */
	// defer close(eMsg)
}

// Get the daemon OS type
func getDaemonOsType(dockerCli *client.Client, dockerCtx context.Context) (string, error) {
	sv, err := dockerCli.ServerVersion(dockerCtx)
	if err != nil {
		return "", err
	}
	return sv.Os, nil
}

func getContainerList(dockerCli *client.Client, dockerCtx context.Context, cStats *stats, wg *sync.WaitGroup, closeChan chan error) {
	defer wg.Done()
	options := types.ContainerListOptions{
		All: opts.all,
	}
	cs, err := dockerCli.ContainerList(dockerCtx, options)
	if err != nil {
		closeChan <- err
	}
	for _, container := range cs {
		/**
		 * type ContainerStats struct {
		 *     mutex sync.Mutex
		 *     StatsEntry
		 *     err error
		 * }
		 */
		// Returns a new *ContainerStats entity and sets in it the given name
		s := formatter.NewContainerStats(container.ID[:12], daemonOSType)
		if cStats.add(s) {
			wg.Add(1)
			go collect(dockerCli, dockerCtx, s, !opts.noStream, wg)
		}
	}
	closeChan <- nil
}

func DockerRunStats(dockerCli *client.Client, dockerCtx context.Context) ([]formatters.Stats, error) {
	log.Println("Starting get list containers statistics.")
	// Expect any asynchronous errors
	closeChan := make(chan error)
	// Set new options
	opts = newStatsOptions()
	// Get the daemonOSType if not set already
	daemonOSType, _ = getDaemonOsType(dockerCli, dockerCtx)
	// waitFirst is a WaitGroup to wait first stat data's reach for each container
	wg := &sync.WaitGroup{}
	// cStats is a list of container(s) resource usage statistics.
	cStats := &stats{ostype: daemonOSType}

	// Start a long running goroutine which monitors container events. We make sure we're subscribed before
	// retrieving the list of running containers to avoid a race where we would "miss" a creation.
	started := make(chan struct{})
	eventChan := make(chan events.Message)
	monitorEvents(dockerCli, dockerCtx, started, eventChan, closeChan)
	<-started

	wg.Add(1)
	go getContainerList(dockerCli, dockerCtx, cStats, wg, closeChan)
	err := <-closeChan
	// Make sure each container get at least one valid stat data
	wg.Wait()
	return formatters.GetListContainerStats(daemonOSType, cStats.cs), err
}
