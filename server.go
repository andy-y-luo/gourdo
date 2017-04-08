package main

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"os"

	"golang.org/x/net/websocket"

	"github.com/tjgq/broadcast"
)

var b broadcast.Broadcaster

type packet struct {
	Op   byte
	Data int32
}

func listenGourdo() {
	l, err := net.Listen("tcp", "localhost:3333")
	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}
	defer l.Close()
	fmt.Println("Listening on localhost:3333")
	for {
		// Listen for an incoming connection.
		conn, err := l.Accept()
		if err != nil {
			fmt.Println("Error accepting: ", err.Error())
			os.Exit(1)
		}
		// Handle connections in a new goroutine.
		go func() {
			var p packet
			err := binary.Read(conn, binary.LittleEndian, &p.Op)
			if err != nil {
				fmt.Println("Error getting op: ", err.Error())
				return
			}
			if p.Op == 0 {
				binary.Read(conn, binary.LittleEndian, &p.Data)
			}
			b.Send(p)
			defer conn.Close()
		}()
	}
}
func wsServer(ws *websocket.Conn) {
	defer ws.Close()
	for p := range b.Listen().Ch {
		ps, err := json.Marshal(p)
		if err != nil {
			fmt.Println("Error marshalling packet:", err)
			return
		}
		ws.Write(ps)
	}
}

func httpServer() {
	http.Handle("/", websocket.Handler(wsServer))
	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}

func main() {
	go listenGourdo()
	go httpServer()
	for {
		fmt.Scanln()
		fmt.Println("Sending example packet")
		b.Send(packet{Op: 0, Data: 1234})
	}
}
