package models

import (
	"time"

	"gorm.io/gorm"
)

type TaskStatus string

const (
	TaskStatusPending   TaskStatus = "pending"
	TaskStatusClaimed   TaskStatus = "claimed"
	TaskStatusCompleted TaskStatus = "completed"
)

type Task struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `json:"description"`
	Price       float64        `json:"price"`
	Status      TaskStatus     `gorm:"default:'pending'" json:"status"`
	Type        string         `json:"type"` // express, professional, etc.
	Latitude    float64        `json:"latitude"`
	Longitude   float64        `json:"longitude"`
	Urgency     bool           `json:"urgency"`
	ViewCount   int            `json:"view_count"`
	CreatorID   uint           `json:"creator_id"`
	Creator     User           `gorm:"foreignKey:CreatorID" json:"creator"`
	ExecutorID  *uint          `json:"executor_id"` // Nullable
	Executor    *User          `gorm:"foreignKey:ExecutorID" json:"executor,omitempty"`
	CircleID    uint           `json:"circle_id"`
}
