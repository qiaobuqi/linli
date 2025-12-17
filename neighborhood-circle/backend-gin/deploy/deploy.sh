#!/bin/bash

# 邻里圈平台自动化部署脚本
# 与ifangche-gin共享Go环境
# 
# 注意事项：
# 1. 数据库需要单独创建
# 2. 应用启动时会自动进行GORM数据库迁移
# 3. 本脚本只验证数据库连接

# 设置Go环境变量（与ifangche-gin共享）
if [ -d "/usr/local/go" ]; then
    export PATH=/usr/local/go/bin:$PATH
    export GOROOT=/usr/local/go
fi

echo "🚀 邻里圈平台部署脚本"
echo "=============================="

# 配置变量
APP_NAME="neighborhood-circle"
APP_DIR="/opt/apps/neighborhood-circle"
# 智能检测源代码目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVICE_NAME="neighborhood-circle"
DOMAIN="wx.cnirv.com"  # 使用子域名，避免与主域名冲突
BUILD_DIR="$APP_DIR/bin"
CONFIG_DIR="$APP_DIR/configs"
LOG_DIR="$APP_DIR/logs"
APP_PORT="8430"  # 使用不同的端口，避免与ifangche-gin(8429)冲突

# 调试信息
echo "脚本目录: $SCRIPT_DIR"
echo "源代码目录: $SOURCE_DIR"
echo "当前工作目录: $(pwd)"
echo "应用端口: $APP_PORT"

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo "❌ 请使用root权限运行此脚本"
        echo "   使用: sudo bash deploy/deploy.sh"
        exit 1
    fi
}

# 检查系统环境
check_environment() {
    echo ""
    echo "📋 检查系统环境..."
    
    # 检查Go环境
    if ! command -v go &> /dev/null; then
        echo "❌ Go未安装或环境变量未正确设置"
        echo "   Go应该已由ifangche-gin项目安装"
        echo "   请检查Go是否安装在 /usr/local/go"
        exit 1
    else
        echo "✅ Go环境已配置 ($(go version))"
    fi
    
    # 检查Nginx
    if ! command -v nginx &> /dev/null; then
        echo "❌ Nginx未安装，请先安装Nginx"
        exit 1
    fi
    
    # 检查Redis
    if ! systemctl is-active --quiet redis-server; then
        echo "❌ Redis服务未运行，正在启动..."
        systemctl start redis-server
        if ! systemctl is-active --quiet redis-server; then
            echo "❌ Redis启动失败"
            exit 1
        fi
    fi
    
    echo "✅ 系统环境检查完成"
}

# 创建目录结构
create_directories() {
    echo ""
    echo "📁 创建目录结构..."
    
    mkdir -p $APP_DIR
    mkdir -p $BUILD_DIR
    mkdir -p $CONFIG_DIR
    mkdir -p $LOG_DIR
    
    # 使用与ifangche-gin相同的appuser
    if ! id "appuser" &>/dev/null; then
        echo "⚠️  appuser不存在，正在创建..."
        useradd -r -s /bin/bash -d /opt/apps appuser
    fi
    
    chown -R appuser:appuser /opt/apps/neighborhood-circle
    echo "✅ 目录结构创建完成"
}

# 编译应用
build_application() {
    echo ""
    echo "🔨 编译应用程序..."
    
    cd $SOURCE_DIR
    
    # 清理旧的编译文件
    go clean
    
    # 设置Go环境
    export GOPROXY=https://goproxy.cn,direct
    export GO111MODULE=on
    
    # 下载依赖
    echo "正在下载依赖..."
    go mod tidy
    go mod download
    
    # 编译应用
    echo "正在编译应用..."
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
        -ldflags="-w -s" \
        -o $BUILD_DIR/$APP_NAME \
        main.go
    
    if [ $? -eq 0 ]; then
        echo "✅ 应用编译成功"
        chmod +x $BUILD_DIR/$APP_NAME
    else
        echo "❌ 应用编译失败"
        exit 1
    fi
}

# 部署web静态文件
deploy_web_files() {
    echo ""
    echo "🌐 部署web静态文件..."
    
    # 检查源web目录是否存在
    if [ ! -d "$SOURCE_DIR/web" ]; then
        echo "⚠️  源web目录不存在，跳过web文件部署"
        return 0
    fi
    
    # 创建web目录
    mkdir -p $APP_DIR/web
    
    # 复制web静态文件
    echo "复制web静态文件..."
    cp -rf $SOURCE_DIR/web/* $APP_DIR/web/
    
    # 设置web文件权限
    chown -R appuser:appuser $APP_DIR/web
    find $APP_DIR/web -type f -exec chmod 644 {} \;
    find $APP_DIR/web -type d -exec chmod 755 {} \;
    
    echo "✅ web静态文件部署完成"
}

# 部署配置文件
deploy_configs() {
    echo ""
    echo "⚙️  部署配置文件..."
    
    # 检查配置文件是否存在
    if [ ! -d "$SOURCE_DIR/configs" ]; then
        echo "⚠️  configs目录不存在，创建示例配置..."
        mkdir -p $SOURCE_DIR/configs
        
        # 创建生产环境配置文件
        cat > $SOURCE_DIR/configs/config.prod.yaml << 'EOF'
# 邻里圈生产环境配置
server:
  port: 8430  # 不同于ifangche-gin的8429端口
  mode: release

database:
  host: "rm-bp1lc5ao7288z3c2n5o.mysql.rds.aliyuncs.com"
  port: 3306
  user: "backend"
  password: "Miga0818"
  dbname: "neighborhood_circle"  # 与ifangche-gin使用同一RDS，但不同的数据库
  max_idle_conns: 10
  max_open_conns: 100

redis:
  host: "127.0.0.1"
  port: 6379
  password: ""
  db: 1  # 使用不同的数据库，避免与ifangche-gin冲突

jwt:
  secret: "neighborhood-circle-jwt-secret-key-2024"
  expire_hours: 720

wechat:
  app_id: "your_wechat_appid"
  app_secret: "your_wechat_appsecret"
EOF
        
        # 创建默认配置文件
        cp $SOURCE_DIR/configs/config.prod.yaml $SOURCE_DIR/configs/config.yaml
    fi
    
    # 复制配置文件
    cp -f $SOURCE_DIR/configs/*.yaml $CONFIG_DIR/
    
    # 设置配置文件权限
    chown -R appuser:appuser $CONFIG_DIR
    chmod 640 $CONFIG_DIR/*.yaml
    
    echo "✅ 配置文件部署完成"
}

# 配置systemd服务
setup_systemd() {
    echo ""
    echo "🔧 配置systemd服务..."
    
    # 创建service文件
    cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=邻里圈平台 - Gin Web服务
Documentation=https://github.com/yourusername/neighborhood-circle
After=network.target redis-server.service
Wants=network.target redis-server.service

[Service]
Type=simple
User=appuser
Group=appuser
WorkingDirectory=$APP_DIR
ExecStartPre=/bin/sleep 5
ExecStart=$BUILD_DIR/$APP_NAME
ExecReload=/bin/kill -HUP \$MAINPID
ExecStop=/bin/kill -TERM \$MAINPID
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

# 环境变量
Environment=ENV=prod
Environment=GIN_MODE=release
Environment=TZ=Asia/Shanghai
Environment=PORT=$APP_PORT

# 安全设置
NoNewPrivileges=true
PrivateTmp=false
ProtectSystem=false
ProtectHome=false
ReadWritePaths=$APP_DIR
ReadWritePaths=/tmp
ReadWritePaths=/var/log

# 资源限制
LimitNOFILE=65535
LimitNPROC=65535

# 超时设置
TimeoutStartSec=60
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
EOF
    
    # 重新加载systemd
    systemctl daemon-reload
    systemctl enable $SERVICE_NAME
    
    echo "✅ systemd服务配置完成"
}

# 配置Nginx (子域名模式)
setup_nginx() {
    echo ""
    echo "🌐 配置Nginx (子域名模式)..."
    
    # 创建独立的Nginx配置（使用子域名）
    cat > /etc/nginx/sites-available/wx.cnirv.com.conf << 'EOF'
# Nginx配置文件 - 邻里圈平台
# 子域名: wx.cnirv.com

# 上游服务器定义
upstream neighborhood_backend {
    server 127.0.0.1:8430;
    keepalive 32;
}

# HTTP服务器
server {
    listen 80;
    server_name wx.cnirv.com;
    
    # Let's Encrypt验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # 日志配置
    access_log /opt/apps/logs/wx.cnirv.com.access.log;
    error_log /opt/apps/logs/wx.cnirv.com.error.log;
    
    # 客户端真实IP
    real_ip_header X-Forwarded-For;
    set_real_ip_from 0.0.0.0/0;
    
    # 文件上传大小限制
    client_max_body_size 50M;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    
    # API路由
    location /api/ {
        proxy_pass http://neighborhood_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 主页面和其他路由
    location / {
        proxy_pass http://neighborhood_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF
    
    echo "✅ Nginx配置文件创建成功"
    
    # 启用站点配置
    rm -f /etc/nginx/sites-enabled/wx.cnirv.com.conf
    ln -sf /etc/nginx/sites-available/wx.cnirv.com.conf /etc/nginx/sites-enabled/
    
    # 测试Nginx配置
    echo "测试Nginx配置..."
    if nginx -t; then
        echo "✅ Nginx配置测试通过"
    else
        echo "❌ Nginx配置测试失败"
        nginx -t
        exit 1
    fi
}

# 数据库连接验证
verify_database() {
    echo ""
    echo "💾 验证数据库连接..."
    
    # 数据库配置
    DB_HOST="rm-bp1lc5ao7288z3c2n5o.mysql.rds.aliyuncs.com"
    DB_PORT="3306"
    DB_USER="backend"
    DB_PASSWORD="Miga0818"
    DB_NAME="neighborhood_circle"
    
    # 检查数据库连接
    echo "检查数据库连接..."
    if command -v mysql &> /dev/null; then
        if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; then
            echo "✅ 数据库连接正常"
            
            # 检查数据库是否存在
            if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" > /dev/null 2>&1; then
                echo "✅ 数据库 $DB_NAME 已存在"
            else
                echo "⚠️  数据库 $DB_NAME 不存在，正在创建..."
                mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
                if [ $? -eq 0 ]; then
                    echo "✅ 数据库创建成功"
                else
                    echo "❌ 数据库创建失败"
                    exit 1
                fi
            fi
        else
            echo "❌ 数据库连接失败，请检查配置"
            exit 1
        fi
    else
        echo "⚠️  mysql客户端未安装，跳过数据库验证"
        echo "提示：应用启动时会自动进行数据库迁移"
    fi
}

# 启动服务
start_services() {
    echo ""
    echo "🎬 启动服务..."
    
    # 停止旧服务
    if systemctl is-active --quiet $SERVICE_NAME; then
        echo "停止现有服务..."
        systemctl stop $SERVICE_NAME
        sleep 3
    fi

    # 强制杀掉残留进程
    echo "检查并清理残留进程..."
    pkill -9 -f "$APP_NAME" 2>/dev/null || true
    sleep 2

    # 确保端口已释放
    if lsof -i :$APP_PORT >/dev/null 2>&1; then
        echo "⚠️  端口$APP_PORT仍被占用，强制清理..."
        lsof -ti :$APP_PORT | xargs kill -9 2>/dev/null || true
        sleep 2
    fi

    # 启动应用服务
    echo "启动应用服务..."
    systemctl start $SERVICE_NAME
    sleep 5
    
    if systemctl is-active --quiet $SERVICE_NAME; then
        echo "✅ 应用服务启动成功"
    else
        echo "❌ 应用服务启动失败"
        systemctl status $SERVICE_NAME --no-pager
        
        echo ""
        echo "📋 最近的服务日志:"
        journalctl -u $SERVICE_NAME -n 30 --no-pager
        
        echo ""
        echo "❌ 部署失败，请检查日志"
        exit 1
    fi
    
    # 重新加载Nginx
    echo "重新加载Nginx..."
    systemctl reload nginx
    if [ $? -eq 0 ]; then
        echo "✅ Nginx重新加载成功"
    else
        echo "❌ Nginx重新加载失败"
        exit 1
    fi
}

# 健康检查
health_check() {
    echo ""
    echo "🔍 健康检查..."
    
    # 等待服务完全启动
    sleep 10
    
    # 检查服务状态
    echo "检查应用服务状态..."
    if systemctl is-active --quiet $SERVICE_NAME; then
        echo "✅ 应用服务运行正常"
    else
        echo "❌ 应用服务运行异常"
        systemctl status $SERVICE_NAME
        return 1
    fi
    
    # 检查端口监听
    echo "检查端口监听..."
    if lsof -i :$APP_PORT >/dev/null 2>&1 || ss -tlnp | grep -q ":$APP_PORT"; then
        echo "✅ 端口$APP_PORT监听正常"
    else
        echo "❌ 端口$APP_PORT未监听"
        return 1
    fi
    
    # 检查HTTP响应
    echo "检查HTTP响应..."
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$APP_PORT/ 2>/dev/null || echo "000")
    if [ "$response" = "200" ] || [ "$response" = "404" ]; then
        echo "✅ HTTP健康检查通过 (状态码: $response)"
    else
        echo "⚠️  HTTP健康检查失败 (状态码: $response)"
    fi
}

# 显示部署结果
show_result() {
    echo ""
    echo "🎉 部署完成！"
    echo "=========================="
    echo "应用名称: $APP_NAME"
    echo "部署目录: $APP_DIR"
    echo "应用端口: $APP_PORT"
    echo "服务状态: $(systemctl is-active $SERVICE_NAME)"
    echo "访问地址: http://$(curl -s ifconfig.me):$APP_PORT"
    echo "子域名: http://$DOMAIN (需要DNS解析)"
    
    echo ""
    echo "📋 服务管理命令："
    echo "  启动服务: sudo systemctl start $SERVICE_NAME"
    echo "  停止服务: sudo systemctl stop $SERVICE_NAME"
    echo "  重启服务: sudo systemctl restart $SERVICE_NAME"
    echo "  查看状态: sudo systemctl status $SERVICE_NAME"
    echo "  查看日志: sudo journalctl -u $SERVICE_NAME -f"
    
    echo ""
    echo "📂 重要文件位置："
    echo "  应用程序: $BUILD_DIR/$APP_NAME"
    echo "  配置文件: $CONFIG_DIR/"
    echo "  日志目录: $LOG_DIR/"
    echo "  Nginx配置: /etc/nginx/sites-available/wx.cnirv.com.conf"
    echo "  服务配置: /etc/systemd/system/$SERVICE_NAME.service"
    
    echo ""
    echo "🔗 与ifangche-gin共存："
    echo "  ifangche-gin: 端口 8429, 域名 cnirv.com"
    echo "  neighborhood-circle: 端口 $APP_PORT, 子域名 $DOMAIN"
    echo "  共享: Go环境, Nginx, Redis(不同DB), MySQL(不同数据库)"
}

# 清理函数
cleanup() {
    echo ""
    echo "🧹 清理临时文件..."
    cd $SOURCE_DIR
    
    if command -v go &> /dev/null; then
        go clean
    fi
    
    echo "✅ 清理完成"
}

# 错误处理
trap cleanup EXIT

# 主函数
main() {
    case "${1:-deploy}" in
        "deploy")
            echo "🚀 开始完整部署流程..."
            check_root
            check_environment
            create_directories
            build_application
            deploy_configs
            deploy_web_files
            setup_systemd
            setup_nginx
            verify_database
            start_services
            health_check
            show_result
            ;;
        "update")
            echo "🔄 开始更新部署..."
            check_root
            build_application
            deploy_configs
            deploy_web_files
            systemctl restart $SERVICE_NAME
            systemctl reload nginx
            health_check
            echo "✅ 更新部署完成"
            ;;
        "build")
            echo "🔨 仅编译应用..."
            build_application
            ;;
        "restart")
            echo "🔄 重启服务..."
            check_root
            systemctl restart $SERVICE_NAME
            systemctl reload nginx
            health_check
            ;;
        "status")
            echo "📊 服务状态检查..."
            health_check
            ;;
        *)
            echo "用法: $0 [deploy|update|build|restart|status]"
            echo "  deploy  - 完整部署（首次部署使用）"
            echo "  update  - 更新部署（代码更新使用）"
            echo "  build   - 仅编译应用"
            echo "  restart - 重启服务"
            echo "  status  - 检查服务状态"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$1"

