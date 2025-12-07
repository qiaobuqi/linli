package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"neighborhood-circle/middlewares"
	"neighborhood-circle/models"
)

type AuthHandler struct {
	DB *gorm.DB
}

type WechatLoginRequest struct {
	Code     string `json:"code" binding:"required"`
	UserInfo struct {
		NickName  string `json:"nickName"`
		AvatarUrl string `json:"avatarUrl"`
	} `json:"userInfo"`
}

func (h *AuthHandler) WechatLogin(c *gin.Context) {
	var req WechatLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Replace with real WeChat API call
	// https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
	// For now, we simulate openid generation based on code
	openID := "mock_openid_" + req.Code

	var user models.User
	// Find or Create User
	result := h.DB.Where("open_id = ?", openID).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			user = models.User{
				OpenID:    openID,
				Nickname:  req.UserInfo.NickName,
				AvatarURL: req.UserInfo.AvatarUrl,
			}
			if err := h.DB.Create(&user).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
	} else {
		// Update user info
		user.Nickname = req.UserInfo.NickName
		user.AvatarURL = req.UserInfo.AvatarUrl
		h.DB.Save(&user)
	}

	token, err := middlewares.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  user,
	})
}
