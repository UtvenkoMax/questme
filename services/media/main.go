// Package main implements the QuestMe Media Processing Pipeline.
//
// Features:
// - Image upload and resizing
// - Thumbnail generation
// - Content moderation queue
// - CDN upload preparation
package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

const (
	maxUploadSize = 10 << 20 // 10 MB
	uploadDir     = "./uploads"
)

type UploadResponse struct {
	ID        string    `json:"id"`
	Filename  string    `json:"filename"`
	Size      int64     `json:"size_bytes"`
	MimeType  string    `json:"mime_type"`
	URL       string    `json:"url"`
	CreatedAt time.Time `json:"created_at"`
}

type ProcessingJob struct {
	ID         string   `json:"id"`
	SourcePath string   `json:"source_path"`
	Operations []string `json:"operations"` // resize, thumbnail, moderate
	Status     string   `json:"status"`     // pending, processing, done, failed
}

var jobQueue = make(chan ProcessingJob, 100)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		http.Error(w, "File too large (max 10MB)", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Missing file field", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Generate unique filename
	hash := sha256.New()
	io.Copy(hash, file)
	fileID := hex.EncodeToString(hash.Sum(nil))[:16]
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%s%s", fileID, ext)

	// Save file
	os.MkdirAll(uploadDir, 0755)
	destPath := filepath.Join(uploadDir, filename)
	file.Seek(0, 0)

	dest, err := os.Create(destPath)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}
	defer dest.Close()
	written, _ := io.Copy(dest, file)

	// Queue processing job
	job := ProcessingJob{
		ID:         fileID,
		SourcePath: destPath,
		Operations: []string{"resize", "thumbnail"},
		Status:     "pending",
	}
	select {
	case jobQueue <- job:
	default:
		log.Printf("[Media] Job queue full, skipping processing for %s", fileID)
	}

	resp := UploadResponse{
		ID:        fileID,
		Filename:  filename,
		Size:      written,
		MimeType:  header.Header.Get("Content-Type"),
		URL:       fmt.Sprintf("/uploads/%s", filename),
		CreatedAt: time.Now().UTC(),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resp)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	resp := map[string]interface{}{
		"status":     "ok",
		"service":    "questme-media",
		"queue_size": len(jobQueue),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// Background worker for processing jobs
func processWorker() {
	for job := range jobQueue {
		log.Printf("[Media] Processing job %s: %v", job.ID, job.Operations)
		// In production: resize with libvips, generate thumbnails, upload to CDN
		time.Sleep(100 * time.Millisecond) // Simulate processing
		log.Printf("[Media] Job %s completed", job.ID)
	}
}

func main() {
	// Start background workers
	for i := 0; i < 4; i++ {
		go processWorker()
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/upload", uploadHandler)
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(uploadDir))))

	addr := ":8084"
	log.Printf("[QuestMe Media] Starting on %s", addr)
	log.Printf("[QuestMe Media] Workers: 4, Max upload: %d MB", maxUploadSize>>20)

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
