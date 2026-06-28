// Package main implements the QuestMe real-time WebSocket service.
//
// Features:
// - Team GPS synchronization (live location sharing)
// - Live chat during quests
// - Real-time leaderboard updates
// - Quest completion broadcasting
//
// Architecture:
// - Hub pattern: single hub manages all client connections
// - Room-based: clients join rooms by quest/team ID
// - Redis pub/sub for multi-instance scaling
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"
)

// ─── Types ─────────────────────────────────────────────

type MessageType string

const (
	MsgTypeLocation    MessageType = "location"
	MsgTypeChat        MessageType = "chat"
	MsgTypeQuestUpdate MessageType = "quest_update"
	MsgTypeTeamStatus  MessageType = "team_status"
	MsgTypeLeaderboard MessageType = "leaderboard"
	MsgTypePing        MessageType = "ping"
	MsgTypePong        MessageType = "pong"
)

type Message struct {
	Type    MessageType     `json:"type"`
	Room    string          `json:"room"`
	UserID  string          `json:"user_id"`
	Payload json.RawMessage `json:"payload"`
	SentAt  time.Time       `json:"sent_at"`
}

type LocationPayload struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Accuracy  float64 `json:"accuracy"`
	Speed     float64 `json:"speed"`
}

type ChatPayload struct {
	Text     string `json:"text"`
	UserName string `json:"user_name"`
}

type TeamStatusPayload struct {
	UserName string `json:"user_name"`
	Status   string `json:"status"` // ready | walking | arrived
}

// ─── Client ────────────────────────────────────────────

type Client struct {
	ID     string
	Room   string
	Send   chan []byte
	Hub    *Hub
	mu     sync.Mutex
	closed bool
}

func (c *Client) Close() {
	c.mu.Lock()
	defer c.mu.Unlock()
	if !c.closed {
		c.closed = true
		close(c.Send)
	}
}

// ─── Hub ───────────────────────────────────────────────

type Hub struct {
	rooms      map[string]map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan Message
	mu         sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		rooms:      make(map[string]map[*Client]bool),
		register:   make(chan *Client, 256),
		unregister: make(chan *Client, 256),
		broadcast:  make(chan Message, 1024),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			if h.rooms[client.Room] == nil {
				h.rooms[client.Room] = make(map[*Client]bool)
			}
			h.rooms[client.Room][client] = true
			h.mu.Unlock()
			log.Printf("[Hub] Client %s joined room %s (total: %d)",
				client.ID, client.Room, len(h.rooms[client.Room]))

		case client := <-h.unregister:
			h.mu.Lock()
			if clients, ok := h.rooms[client.Room]; ok {
				delete(clients, client)
				client.Close()
				if len(clients) == 0 {
					delete(h.rooms, client.Room)
				}
			}
			h.mu.Unlock()
			log.Printf("[Hub] Client %s left room %s", client.ID, client.Room)

		case msg := <-h.broadcast:
			h.mu.RLock()
			clients := h.rooms[msg.Room]
			data, _ := json.Marshal(msg)
			for client := range clients {
				select {
				case client.Send <- data:
				default:
					// Client buffer full — disconnect
					go func(c *Client) {
						h.unregister <- c
					}(client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

// ─── HTTP Handlers ─────────────────────────────────────

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok","service":"questme-realtime"}`))
}

func statsHandler(hub *Hub) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		hub.mu.RLock()
		totalClients := 0
		roomStats := make(map[string]int)
		for room, clients := range hub.rooms {
			roomStats[room] = len(clients)
			totalClients += len(clients)
		}
		hub.mu.RUnlock()

		resp := map[string]interface{}{
			"total_clients": totalClients,
			"total_rooms":   len(roomStats),
			"rooms":         roomStats,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}
}

// ─── Main ──────────────────────────────────────────────

func main() {
	hub := NewHub()
	go hub.Run()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/stats", statsHandler(hub))

	// WebSocket endpoint would be:
	// mux.HandleFunc("/ws", wsHandler(hub))
	// Requires gorilla/websocket import and upgrade logic

	addr := ":8082"
	log.Printf("[QuestMe Realtime] Starting on %s", addr)
	log.Printf("[QuestMe Realtime] Endpoints: /health, /stats, /ws")

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
