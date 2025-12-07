package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"neighborhood-circle/handlers"
	"neighborhood-circle/middlewares"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	authHandler := &handlers.AuthHandler{DB: db}
	taskHandler := &handlers.TaskHandler{DB: db}
	userHandler := &handlers.UserHandler{DB: db}

	// API V1 Group
	v1 := r.Group("/api/v1")
	{
		// Auth Routes
		auth := v1.Group("/auth")
		{
			auth.POST("/wechat-login", authHandler.WechatLogin)
		}

		// Public Routes
		v1.GET("/leaderboard", userHandler.GetLeaderboard)
		
		// Protected Routes
		protected := v1.Group("/")
		protected.Use(middlewares.JWTAuth())
		{
			// Task Routes
			tasks := protected.Group("/tasks")
			{
				tasks.POST("", taskHandler.CreateTask)
				tasks.GET("", taskHandler.GetTasks)
				tasks.GET("/:id", taskHandler.GetTaskDetail)
			}
			
			// User Routes
			protected.GET("/user/profile", userHandler.GetUserProfile)
		}
	}

	return r
}
