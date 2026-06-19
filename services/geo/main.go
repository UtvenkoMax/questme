// Package main implements the QuestMe Geo Microservice.
//
// Server-side geolocation operations:
// - Geofence verification (validates user reached checkpoint)
// - Reverse geocoding cache
// - Quest clustering for map display
// - Route distance calculation
package main

import (
	"encoding/json"
	"log"
	"math"
	"net/http"
	"strconv"
)

const earthRadiusMeters = 6_371_000.0

type Coordinate struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type GeofenceRequest struct {
	UserLocation Coordinate `json:"user_location"`
	Checkpoint   Coordinate `json:"checkpoint"`
	RadiusMeters float64    `json:"radius_meters"`
}

type GeofenceResponse struct {
	Inside   bool    `json:"inside"`
	Distance float64 `json:"distance_meters"`
}

type NearbyRequest struct {
	Origin   Coordinate `json:"origin"`
	RadiusKm float64    `json:"radius_km"`
}

func haversine(a, b Coordinate) float64 {
	dLat := (b.Latitude - a.Latitude) * math.Pi / 180
	dLng := (b.Longitude - a.Longitude) * math.Pi / 180
	aLat := a.Latitude * math.Pi / 180
	bLat := b.Latitude * math.Pi / 180

	sinDLat := math.Sin(dLat / 2)
	sinDLng := math.Sin(dLng / 2)
	h := sinDLat*sinDLat + math.Cos(aLat)*math.Cos(bLat)*sinDLng*sinDLng

	return earthRadiusMeters * 2 * math.Atan2(math.Sqrt(h), math.Sqrt(1-h))
}

func geofenceHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req GeofenceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	dist := haversine(req.UserLocation, req.Checkpoint)
	resp := GeofenceResponse{
		Inside:   dist <= req.RadiusMeters,
		Distance: math.Round(dist*100) / 100,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func routeDistanceHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var route []Coordinate
	if err := json.NewDecoder(r.Body).Decode(&route); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	totalDist := 0.0
	for i := 1; i < len(route); i++ {
		totalDist += haversine(route[i-1], route[i])
	}

	resp := map[string]interface{}{
		"distance_meters": math.Round(totalDist*100) / 100,
		"distance_km":     math.Round(totalDist/10) / 100,
		"points":          len(route),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok","service":"questme-geo"}`))
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/geofence/verify", geofenceHandler)
	mux.HandleFunc("/api/route/distance", routeDistanceHandler)

	port := "8083"
	addr := ":" + port
	log.Printf("[QuestMe Geo] Starting on %s", addr)
	_ = strconv.Itoa(0) // suppress unused import

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
