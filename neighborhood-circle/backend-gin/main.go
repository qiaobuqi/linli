package main

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"neighborhood-circle/models"
	"neighborhood-circle/routes"
)

func main() {
	// Database Connection
	// Default to a local DSN if env var not set
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=neighborhood port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Migration
	err = db.AutoMigrate(&models.User{}, &models.Task{}, &models.Circle{}, &models.Application{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Router Setup
	r := routes.SetupRouter(db)

	// Run
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
