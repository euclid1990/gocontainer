package main

import (
	"./config"
	"./socket"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"
)

const (
	srvPort    = 3002
	srvTimeout = 15
)

var (
	so *socket.Socket
)

func main() {
	// Server IP:Port via command-line flags
	var port = flag.Int("port", srvPort, "http port")
	var addr = flag.String("addr", fmt.Sprintf(":%v", *port), "http service address")
	flag.Parse()

	// Create new socket hub maintains the set of active clients
	so = socket.New()
	so.Run()

	// Register a couple of URL paths and handlers
	r := config.NewRouter(so)
	config.ListingRoutes(r)

	srv := &http.Server{
		Handler:      r,
		Addr:         *addr,
		WriteTimeout: srvTimeout * time.Second,
		ReadTimeout:  srvTimeout * time.Second,
	}
	svErr := srv.ListenAndServe()
	log.Fatal(svErr)
}
