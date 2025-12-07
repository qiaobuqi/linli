package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"neighborhood-circle/models"
)

type UserHandler struct {
	DB *gorm.DB
}

func (h *UserHandler) GetLeaderboard(c *gin.Context) {
	var users []models.User
	// Get Top 10 users by reputation
	if err := h.DB.Order("reputation desc").Limit(10).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leaderboard"})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) GetUserProfile(c *gin.Context) {
	userID, _ := c.Get("userID")
	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}
