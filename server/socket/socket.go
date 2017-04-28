package socket

import (
	"log"
	"net/http"
)

type Socket struct {
	hub *Hub
}

func New() *Socket {
	socket := new(Socket)
	socket = &Socket{hub: new(Hub)}
	socket.hub.new()
	return socket
}

// ServeWs handles websocket requests from the peer.
func (s *Socket) ServeWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{hub: s.hub, conn: conn, send: make(chan []byte, 256)}
	client.hub.register <- client
	go client.writePump()
	client.readPump()
}

// Listen data from hub
func (s *Socket) Run() {
	go s.hub.run()
}
