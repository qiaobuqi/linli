package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"neighborhood-circle/models"
	"neighborhood-circle/routes"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// 获取环境变量，判断是开发环境还是生产环境
	env := os.Getenv("ENV")
	if env == "" {
		env = "dev" // 默认开发环境
	}

	var dsn string

	// 根据环境选择不同的数据库
	if env == "prod" {
		// 生产环境：使用阿里云RDS，neighborhood_circle数据库
		dbHost := getEnv("DB_HOST", "rm-bp1lc5ao7288z3c2n5o.mysql.rds.aliyuncs.com")
		dbPort := getEnv("DB_PORT", "3306")
		dbUser := getEnv("DB_USER", "backend")
		dbPassword := getEnv("DB_PASSWORD", "Miga0818")
		dbName := getEnv("DB_NAME", "neighborhood_circle")

		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			dbUser, dbPassword, dbHost, dbPort, dbName)

		log.Printf("🚀 生产环境启动 - 数据库: %s/%s", dbHost, dbName)
	} else {
		// 开发环境：使用测试数据库 neighborhood_circle_dev
		dbHost := getEnv("DB_HOST", "rm-bp1lc5ao7288z3c2n5o.mysql.rds.aliyuncs.com")
		dbPort := getEnv("DB_PORT", "3306")
		dbUser := getEnv("DB_USER", "backend")
		dbPassword := getEnv("DB_PASSWORD", "Miga0818")
		dbName := getEnv("DB_NAME", "neighborhood_circle_dev")

		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			dbUser, dbPassword, dbHost, dbPort, dbName)

		log.Printf("🔧 开发环境启动 - 数据库: %s/%s", dbHost, dbName)
	}

	// 连接数据库（如果数据库不存在，先创建）
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		// 如果数据库不存在，尝试创建
		if strings.Contains(err.Error(), "Unknown database") {
			log.Printf("⚠️  数据库不存在，尝试创建...")
			if createErr := createDatabase(env); createErr != nil {
				log.Fatal("❌ 数据库创建失败:", createErr)
			}
			// 重新连接
			db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
			if err != nil {
				log.Fatal("❌ 数据库连接失败:", err)
			}
		} else {
			log.Fatal("❌ 数据库连接失败:", err)
		}
	}

	log.Println("✅ 数据库连接成功")

	// 自动迁移数据表
	log.Println("🔄 开始数据库迁移...")
	err = db.AutoMigrate(
		&models.User{},
		&models.Task{},
		&models.Circle{},
		&models.Application{},
		&models.Review{},
	)
	if err != nil {
		log.Fatal("❌ 数据库迁移失败:", err)
	}
	log.Println("✅ 数据库迁移完成")

	// 设置路由
	r := routes.SetupRouter(db)

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8430"
	}

	log.Printf("🎉 服务器启动在端口: %s", port)
	log.Printf("📍 访问地址: http://localhost:%s", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatal("❌ 服务器启动失败:", err)
	}
}

// getEnv 获取环境变量，如果不存在则返回默认值
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// getDbNameFromEnv 根据环境获取数据库名
func getDbNameFromEnv(env string) string {
	if env == "prod" {
		return getEnv("DB_NAME", "neighborhood_circle")
	}
	return getEnv("DB_NAME", "neighborhood_circle_dev")
}

// createDatabase 创建数据库
func createDatabase(env string) error {
	dbHost := getEnv("DB_HOST", "rm-bp1lc5ao7288z3c2n5o.mysql.rds.aliyuncs.com")
	dbPort := getEnv("DB_PORT", "3306")
	dbUser := getEnv("DB_USER", "backend")
	dbPassword := getEnv("DB_PASSWORD", "Miga0818")
	dbName := getDbNameFromEnv(env)

	// 连接到MySQL服务器（不指定数据库）
	dsnWithoutDB := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort)

	db, err := gorm.Open(mysql.Open(dsnWithoutDB), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("无法连接到MySQL服务器: %v", err)
	}

	// 创建数据库
	createSQL := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", dbName)
	if err := db.Exec(createSQL).Error; err != nil {
		return fmt.Errorf("创建数据库失败: %v", err)
	}

	log.Printf("✅ 数据库 %s 创建成功", dbName)
	return nil
}
