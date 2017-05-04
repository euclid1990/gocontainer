package controllers

import (
	"context"
	"github.com/docker/docker/client"
)

type Engine struct {
	ctx context.Context
	cli *client.Client
}

func (c *Engine) new() {
	ctx := context.Background()
	cli, err := client.NewEnvClient()
	if err != nil {
		panic(err)
	}
	*c = Engine{
		ctx: ctx,
		cli: cli,
	}
}

func NewEngine() *Engine {
	var engine *Engine
	engine = new(Engine)
	engine.new()
	return engine
}

var (
	DockerEngine *Engine
)
