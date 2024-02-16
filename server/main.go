package main

import (
	"fmt"
	"log"
	"time"

	"github.com/gocql/gocql"
)

func main() {
	// Connect to the cluster
	cluster := gocql.NewCluster("127.0.0.1")
	cluster.Keyspace = "stats" // Set your keyspace
	cluster.Consistency = gocql.Quorum
	session, err := cluster.CreateSession()
	if err != nil {
		log.Fatal(err)
	}
	defer session.Close()

	// Define your query
	var id int
	var userId int
	var productId int
	var timeTaken time.Time
	query := session.Query("SELECT id, user_id, product_id, time_taken FROM user_stats LIMIT 1")

	// Execute the query
	iter := query.Iter()
	for iter.Scan(&id, &userId, &productId, &timeTaken) {
		fmt.Printf("ID: %d, User ID: %d, Product ID: %d, Time Taken: %s\n", id, userId, productId, timeTaken)

	}
	if err := iter.Close(); err != nil {
		log.Fatal(err)
	}
}
