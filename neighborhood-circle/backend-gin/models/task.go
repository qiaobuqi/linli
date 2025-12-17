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
	TaskStatusCancelled TaskStatus = "cancelled"
)

type TaskType string

const (
	TaskTypeExpress     TaskType = "express"      // 代取快递
	TaskTypePet         TaskType = "pet"          // 宠物照顾
	TaskTypeCarpool     TaskType = "carpool"      // 顺风车
	TaskTypeSecondhand  TaskType = "secondhand"   // 二手买卖
	TaskTypeRepair      TaskType = "repair"       // 维修服务
	TaskTypeCleaning    TaskType = "cleaning"     // 保洁服务
	TaskTypeFood        TaskType = "food"         // 美食分享
	TaskTypeOther       TaskType = "other"        // 其他帮助
)

type Task struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	
	// 基本信息
	Title       string         `gorm:"not null;size:100" json:"title"`
	Description string         `gorm:"type:text" json:"description"`
	Price       float64        `gorm:"not null" json:"price"`
	Status      TaskStatus     `gorm:"default:'pending';index" json:"status"`
	Type        TaskType       `gorm:"not null;index" json:"type"`
	
	// 位置信息
	Latitude    float64        `json:"latitude"`
	Longitude   float64        `json:"longitude"`
	Location    string         `gorm:"size:200" json:"location"` // 位置描述
	
	// 任务属性
	Urgency     bool           `gorm:"default:false;index" json:"urgency"`
	ViewCount   int            `gorm:"default:0" json:"view_count"`
	
	// 图片
	Images      string         `gorm:"type:text" json:"images"` // JSON array of image URLs
	
	// 关联关系
	CreatorID   uint           `gorm:"not null;index" json:"creator_id"`
	Creator     User           `gorm:"foreignKey:CreatorID" json:"creator"`
	ExecutorID  *uint          `gorm:"index" json:"executor_id"` // Nullable
	Executor    *User          `gorm:"foreignKey:ExecutorID" json:"executor,omitempty"`
	CircleID    uint           `gorm:"index" json:"circle_id"`
	
	// 申请人数和统计
	ApplicantCount int         `gorm:"default:0" json:"applicant_count"`
	
	// 预约时间（可选）
	ScheduledAt *time.Time     `json:"scheduled_at,omitempty"`
	CompletedAt *time.Time     `json:"completed_at,omitempty"`
}

// Application represents a user's application to claim a task
type Application struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	TaskID    uint           `gorm:"not null;index" json:"task_id"`
	Task      Task           `gorm:"foreignKey:TaskID" json:"task"`
	UserID    uint           `gorm:"not null;index" json:"user_id"`
	User      User           `gorm:"foreignKey:UserID" json:"user"`
	
	Message   string         `gorm:"type:text" json:"message"` // 申请留言
	Status    string         `gorm:"default:'pending'" json:"status"` // pending, accepted, rejected
}
