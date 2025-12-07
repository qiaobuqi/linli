package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"neighborhood-circle/models"
	"neighborhood-circle/utils"
)

type TaskHandler struct {
	DB *gorm.DB
}

func (h *TaskHandler) CreateTask(c *gin.Context) {
	userID, _ := c.Get("userID")

	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.CreatorID = userID.(uint)
	task.Status = models.TaskStatusPending

	if err := h.DB.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func (h *TaskHandler) GetTasks(c *gin.Context) {
	latStr := c.Query("lat")
	lonStr := c.Query("long")
	
	var tasks []models.Task
	query := h.DB.Preload("Creator").Preload("Executor")

	if err := query.Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}

	// Simple in-memory filtering for demo (production should use PostGIS)
	if latStr != "" && lonStr != "" {
		lat, _ := strconv.ParseFloat(latStr, 64)
		lon, _ := strconv.ParseFloat(lonStr, 64)
		var nearbyTasks []models.Task
		for _, task := range tasks {
			// Filter 5km radius
			if utils.CalculateDistance(lat, lon, task.Latitude, task.Longitude) <= 5.0 {
				nearbyTasks = append(nearbyTasks, task)
			}
		}
		c.JSON(http.StatusOK, nearbyTasks)
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func (h *TaskHandler) GetTaskDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var task models.Task
	if err := h.DB.Preload("Creator").Preload("Executor").First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, task)
}
