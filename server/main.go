package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gocql/gocql"
)

var session *gocql.Session

func init() {
	// Initialize ScyllaDB connection
	cluster := gocql.NewCluster("127.0.0.1")
	cluster.Keyspace = "task1"
	var err error
	session, err = cluster.CreateSession()
	if err != nil {
		log.Fatal(err)
	}

	// Ensure the connection is successful
	if err := session.Query("SELECT release_version FROM system.local").Consistency(gocql.One).Scan(nil); err != nil {
		log.Fatal("Error connecting to ScyllaDB:", err)
	}
}

func main() {
	// Create a new Gin router
	router := gin.Default()
	router.Use(cors.Default())
	// Define a route and handler function for the root endpoint
	router.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello, ScyllaDB Go Server!")
	})

	// Define a route and handler function for /userStats/{userId} endpoint
	router.GET("/userStats/:userId", getUserStats)

	// Start the server on port 8080
	port := 8080
	fmt.Printf("Server is listening on port %d...\n", port)
	err := router.Run(fmt.Sprintf(":%d", port))
	if err != nil {
		fmt.Println("Error:", err)
	}
}

func getUserStats(c *gin.Context) {
	userId := c.Param("userId")

	query := "SELECT product_id, time_taken FROM task1.user_stats WHERE user_id = ? ALLOW FILTERING"
	iter := session.Query(query, userId).Iter()

	defer iter.Close() // Ensure the iterator is closed when the function exits

	// log.Printf("Executed query: %s with userId: %s\n", query, userId)
	// fmt.Println(iter.NumRows())

	if iter.NumRows() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var productID int
	var timeTaken int64

	if iter.Scan(&productID, &timeTaken) {
		timeTakenInSeconds := timeTaken / 1000
		response := gin.H{
			"data": gin.H{
				"product_id": productID,
				"time_taken": timeTakenInSeconds,
			},
		}
		c.JSON(http.StatusOK, response)
		return
	}

	c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
}
