package models

import (
	"time"

	"gorm.io/gorm"
)

type Circle struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Name      string         `gorm:"not null" json:"name"`
	Latitude  float64        `json:"latitude"`
	Longitude float64        `json:"longitude"`
	Address   string         `json:"address"`
}
