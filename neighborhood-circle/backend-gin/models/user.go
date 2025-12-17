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

	// 微信信息
	OpenID    string `gorm:"size:128;uniqueIndex;not null" json:"openid"` // WeChat OpenID
	Nickname  string `gorm:"size:50" json:"nickname"`
	AvatarURL string `gorm:"size:500" json:"avatar_url"`

	// 个人信息
	Bio   string `gorm:"size:200" json:"bio"`            // 个人简介
	Phone string `gorm:"size:20" json:"phone,omitempty"` // 手机号

	// 钱包
	Balance       float64 `gorm:"default:0" json:"balance"`
	FrozenBalance float64 `gorm:"default:0" json:"frozen_balance"` // 冻结金额

	// 等级系统
	Level      int `gorm:"default:1;index" json:"level"`
	Experience int `gorm:"default:0" json:"experience"`

	// 信用体系
	CreditScore int `gorm:"default:100;index" json:"credit_score"` // 信用分 (0-150)

	// 统计数据
	PublishCount  int `gorm:"default:0" json:"publish_count"`  // 发布任务数
	ClaimCount    int `gorm:"default:0" json:"claim_count"`    // 接单任务数
	CompleteCount int `gorm:"default:0" json:"complete_count"` // 完成任务数
	CollectCount  int `gorm:"default:0" json:"collect_count"`  // 收藏数

	// 认证状态
	Verified bool `gorm:"default:false" json:"verified"` // 是否实名认证

	// 标签（存储为JSON字符串）
	Tags string `gorm:"type:text" json:"tags"` // 用户标签

	// 旧字段（兼容性）
	Reputation float64 `gorm:"default:100.0" json:"reputation"`
}

// Review represents a review/rating for a completed task
type Review struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	TaskID uint `gorm:"not null;index" json:"task_id"`
	Task   Task `gorm:"foreignKey:TaskID" json:"task"`

	ReviewerID uint `gorm:"not null;index" json:"reviewer_id"` // 评价人
	Reviewer   User `gorm:"foreignKey:ReviewerID" json:"reviewer"`

	RevieweeID uint `gorm:"not null;index" json:"reviewee_id"` // 被评价人
	Reviewee   User `gorm:"foreignKey:RevieweeID" json:"reviewee"`

	Rating  int    `gorm:"not null" json:"rating"` // 1-5 stars
	Content string `gorm:"type:text" json:"content"`
	Type    string `gorm:"not null" json:"type"` // creator or executor
}
