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

type Application struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	TaskID    uint           `json:"task_id"`
	ApplicantID uint         `json:"applicant_id"`
	Status    string         `gorm:"default:'pending'" json:"status"` // pending, approved, rejected
}
