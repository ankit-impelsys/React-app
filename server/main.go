package main

import (
	"encoding/json"
	"log"
	"net/http"
	

	"github.com/gocql/gocql"
	"github.com/gorilla/mux"
)

func main() {
	// Create HTTP server and define routes
	router := mux.NewRouter()
	router.HandleFunc("/data", getData).Methods("GET")

	// Add CORS middleware
	corsHandler := corsMiddleware(router)

	// Start the HTTP server
	port := ":8080"
	log.Printf("Server listening on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, corsHandler))
}

func corsMiddleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// If it's an OPTIONS request, just return with a 200 status
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		h.ServeHTTP(w, r)
	})
}

func getData(w http.ResponseWriter, r *http.Request) {
	// Get the user_id from query parameters
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "Missing user_id parameter", http.StatusBadRequest)
		return
	}

	// Connect to the ScyllaDB cluster
	cluster := gocql.NewCluster("127.0.0.1")
	cluster.Keyspace = "stats"
	cluster.Consistency = gocql.Quorum
	session, err := cluster.CreateSession()
	if err != nil {
		log.Println("Error connecting to ScyllaDB:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer session.Close()

	// Define your query with user_id filter and ALLOW FILTERING
	var id int
	var userId int
	var productId int
	var timeTaken int 
	query := session.Query("SELECT id, user_id, product_id, time_taken FROM user_stats WHERE user_id = ? ALLOW FILTERING", userID)

	// Execute the query
	iter := query.Iter()
	var data []map[string]interface{}
	for iter.Scan(&id, &userId, &productId, &timeTaken) {
		item := map[string]interface{}{
			"id":         id,
			"user_id":    userId,
			"product_id": productId,
			"time_taken": timeTaken,
		}
		data = append(data, item)
	}
	if err := iter.Close(); err != nil {
		log.Println("Error fetching data from ScyllaDB:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Convert data to JSON and send response
	jsonResponse, err := json.Marshal(data)
	if err != nil {
		log.Println("Error marshaling JSON:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

