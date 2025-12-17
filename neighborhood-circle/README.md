# 邻里圈 Neighborhood Circle

基于微信小程序的社区互助平台，提供代取快递、宠物照顾、顺风车、二手交易等邻里互助服务。

## 📁 项目结构

- `backend-gin/`: Go 后端 (Gin + GORM + MySQL)
- `frontend-miniprogram/`: 微信小程序前端
- `OPTIMIZATION_SUMMARY.md`: 详细的优化报告

## 🚀 快速开始

### 开发环境

#### 后端开发

```bash
# 1. 进入后端目录
cd backend-gin

# 2. 运行后端服务（自动连接开发数据库）
go run main.go

# 服务将启动在: http://localhost:8430
# 数据库: neighborhood_circle_dev（自动创建）
```

#### 前端开发

1. 打开微信开发者工具
2. 导入 `frontend-miniprogram` 目录
3. 使用测试 AppID 或自己的 AppID
4. 在详情中勾选"不校验合法域名"
5. 后端地址已配置为 `http://localhost:8430`

### 生产环境部署

#### 服务器要求
- Ubuntu 20.04/22.04
- 已安装 Go 环境（与 ifangche-gin 共享）
- 已安装 Nginx、Redis、MySQL客户端

#### 部署步骤

```bash
# 1. 上传代码到服务器
scp -r neighborhood-circle root@your-server:/opt/apps/

# 2. 进入项目目录
cd /opt/apps/neighborhood-circle/backend-gin

# 3. 首次部署
sudo bash deploy/deploy.sh deploy

# 4. 后续更新
sudo bash deploy/deploy.sh update
```

## ✅ 如何验证部署成功

### 1. 查看服务状态

```bash
# 检查服务是否运行
sudo systemctl status neighborhood-circle

# 应该看到: Active: active (running)
```

### 2. 查看服务日志

```bash
# 实时查看日志
sudo journalctl -u neighborhood-circle -f

# 查看最近50行日志
sudo journalctl -u neighborhood-circle -n 50

# 成功的日志应该包含:
# ✅ 数据库连接成功
# ✅ 数据库迁移完成
# 🎉 服务器启动在端口: 8430
```

### 3. 检查端口监听

```bash
# 检查端口8430是否被监听
sudo lsof -i :8430
# 或
sudo ss -tlnp | grep 8430

# 应该看到 neighborhood-circle 进程在监听该端口
```

### 4. 测试API接口

```bash
# 健康检查
curl http://localhost:8430/health
# 应该返回: healthy

# 测试获取任务列表
curl http://localhost:8430/api/v1/tasks
# 应该返回JSON格式的任务列表

# 通过域名访问（需要DNS解析）
curl http://wx.cnirv.com/health
```

### 5. 检查Nginx配置

```bash
# 测试Nginx配置
sudo nginx -t

# 查看Nginx错误日志
sudo tail -f /opt/apps/logs/wx.cnirv.com.error.log

# 查看Nginx访问日志
sudo tail -f /opt/apps/logs/wx.cnirv.com.access.log
```

### 6. 检查数据库连接

```bash
# 连接数据库验证数据
mysql -h rm-bp1lc5ao7288z3c2n5o.mysql.rds.aliyuncs.com -u backend -pMiga0818 neighborhood_circle

# 查看表和数据
mysql> USE neighborhood_circle;
mysql> SHOW TABLES;
mysql> SELECT COUNT(*) FROM tasks;
mysql> SELECT COUNT(*) FROM users;
```

## 🔧 常用管理命令

```bash
# 启动服务
sudo systemctl start neighborhood-circle

# 停止服务
sudo systemctl stop neighborhood-circle

# 重启服务
sudo systemctl restart neighborhood-circle

# 查看服务状态
sudo systemctl status neighborhood-circle

# 查看实时日志
sudo journalctl -u neighborhood-circle -f

# 重新加载Nginx
sudo systemctl reload nginx
```

## 🗄️ 数据库说明

### 开发环境
- 数据库: `neighborhood_circle_dev`
- 用途: 本地开发测试
- 自动创建测试数据

### 生产环境
- 数据库: `neighborhood_circle`
- 用途: 线上正式环境
- RDS: rm-bp1lc5ao7288z3c2n5o.mysql.rds.aliyuncs.com

### 插入测试数据

```bash
cd backend-gin
mysql -h rm-bp1lc5ao7288z3c2n5o.mysql.rds.aliyuncs.com -u backend -pMiga0818 neighborhood_circle_dev < scripts/seed_test_data.sql
```

## 🌐 服务配置

### 端口和域名
- **开发环境**: http://localhost:8430
- **生产环境**: http://wx.cnirv.com (需要DNS解析)
- **后端端口**: 8430（与 ifangche-gin:8429 不冲突）

### 与 ifangche-gin 共存
- ✅ 共享 Go 环境
- ✅ 共享 Nginx 服务器
- ✅ 共享 Redis（使用不同 db）
- ✅ 共享 MySQL RDS（使用不同数据库）
- ✅ 使用不同端口和子域名

## 📊 功能特性

- **用户认证**: 微信登录 + JWT
- **任务管理**: 发布、浏览、接单任务
- **服务分类**: 8大类服务（快递、宠物、顺风车、二手、维修、保洁、美食、其他）
- **信用体系**: 信用分、等级、成就系统
- **评价系统**: 5星评价 + 文字评论
- **实时数据**: 连接真实后端API

## 📝 开发说明

- 后端框架: Gin
- 数据库: MySQL 8.0 (GORM)
- 缓存: Redis
- 前端: 微信小程序原生开发
- 认证: JWT Token

## 🆘 常见问题

### 部署失败
1. 检查 Go 环境: `go version`
2. 检查数据库连接: 测试 RDS 白名单
3. 检查端口占用: `sudo lsof -i :8430`
4. 查看详细日志: `sudo journalctl -u neighborhood-circle -n 100`

### 服务无法访问
1. 检查防火墙: `sudo ufw status`
2. 检查 Nginx 配置: `sudo nginx -t`
3. 检查服务状态: `sudo systemctl status neighborhood-circle`
4. 检查 DNS 解析: `ping wx.cnirv.com`

### 数据库问题
1. 验证连接: 使用 mysql 客户端测试连接
2. 检查白名单: 确保服务器 IP 在 RDS 白名单中
3. 查看迁移日志: 服务启动日志中查看数据库迁移信息

## 📧 联系方式

如有问题，请查看日志或联系开发团队。
