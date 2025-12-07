package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	OpenID    string         `gorm:"uniqueIndex;not null" json:"openid"` // WeChat OpenID
	Nickname  string         `json:"nickname"`
	AvatarURL string         `json:"avatar_url"`
	Balance   float64        `gorm:"default:0" json:"balance"`
	Level     int            `gorm:"default:1" json:"level"`
	Experience int           `gorm:"default:0" json:"experience"`
	Reputation float64       `gorm:"default:100.0" json:"reputation"`
}
