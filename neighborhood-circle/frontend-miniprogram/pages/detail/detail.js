import { request } from '../../utils/request';

Page({
    data: {
        task: null,
        loading: true,
        collected: false,
        similarTasks: [],
        
        // 状态配置
        statusConfig: {
            pending: { icon: '⏳', text: '等待接单中' },
            claimed: { icon: '🤝', text: '已有人接单' },
            completed: { icon: '✅', text: '任务已完成' }
        }
    },

    onLoad(options) {
        if (options.id) {
            this.fetchDetail(options.id);
        }
    },

    onShow() {
        // 检查收藏状态
        this.checkCollectionStatus();
    },

    // 获取任务详情
    fetchDetail(id) {
        wx.showLoading({ title: '加载中...', mask: true });
        
        request({
            url: `/tasks/${id}`,
            method: 'GET'
        }).then(res => {
            // 添加类型相关信息
            const typeMap = {
                express: { emoji: '📦', name: '代取快递' },
                pet: { emoji: '🐕', name: '宠物照顾' },
                carpool: { emoji: '🚗', name: '顺风车' },
                secondhand: { emoji: '♻️', name: '二手买卖' },
                repair: { emoji: '🔧', name: '维修服务' },
                cleaning: { emoji: '🧹', name: '保洁服务' },
                food: { emoji: '🍜', name: '美食分享' },
                other: { emoji: '💡', name: '其他帮助' }
            };
            
            const taskType = typeMap[res.type] || typeMap.other;
            
            this.setData({
                task: {
                    ...res,
                    typeEmoji: taskType.emoji,
                    typeName: taskType.name
                },
                loading: false
            });
            
            wx.hideLoading();
            
            // 加载类似任务
            this.fetchSimilarTasks(res.type);
            
            // 增加浏览次数（实际应该调用API）
            this.incrementViewCount(id);
        }).catch(err => {
            wx.hideLoading();
            console.error('加载失败:', err);
            wx.showToast({ 
                title: '加载失败，请重试', 
                icon: 'none' 
            });
        });
    },

    // 获取类似任务
    fetchSimilarTasks(type) {
        request({
            url: `/tasks?type=${type}&limit=5`,
            method: 'GET'
        }).then(res => {
            const typeMap = {
                express: '代取快递',
                pet: '宠物照顾',
                carpool: '顺风车',
                secondhand: '二手买卖',
                repair: '维修服务',
                cleaning: '保洁服务',
                food: '美食分享',
                other: '其他帮助'
            };
            
            const tasks = res.map(task => ({
                ...task,
                typeName: typeMap[task.type] || typeMap.other
            }));
            
            this.setData({
                similarTasks: tasks.slice(0, 5)
            });
        }).catch(err => {
            console.log('类似任务加载失败', err);
        });
    },

    // 增加浏览次数
    incrementViewCount(id) {
        // TODO: 调用API增加浏览次数
        console.log('增加浏览次数:', id);
    },

    // 检查收藏状态
    checkCollectionStatus() {
        // TODO: 从本地存储或服务器获取收藏状态
        const collected = wx.getStorageSync(`collected_${this.data.task?.id}`) || false;
        this.setData({ collected });
    },

    // 接单
    claimTask() {
        const { task } = this.data;
        
        wx.showModal({
            title: '确认接单',
            content: `确定要接下这个任务吗？报酬：¥${task.price}`,
            confirmText: '确认接单',
            cancelText: '再想想',
            success: (res) => {
                if (res.confirm) {
                    wx.showLoading({ title: '提交中...', mask: true });
                    
                    request({
                        url: `/tasks/${task.id}/claim`,
                        method: 'POST'
                    }).then(() => {
                        wx.hideLoading();
                        wx.showToast({ 
                            title: '接单成功！', 
                            icon: 'success' 
                        });
                        
                        // 更新任务状态
                        setTimeout(() => {
                            this.fetchDetail(task.id);
                        }, 1500);
                    }).catch(err => {
                        wx.hideLoading();
                        console.error('接单失败:', err);
                        wx.showToast({ 
                            title: '接单失败，请重试', 
                            icon: 'none' 
                        });
                    });
                }
            }
        });
    },

    // 切换收藏
    toggleCollect() {
        const { task, collected } = this.data;
        const newCollected = !collected;
        
        this.setData({ collected: newCollected });
        
        // 保存到本地存储
        wx.setStorageSync(`collected_${task.id}`, newCollected);
        
        wx.showToast({
            title: newCollected ? '已收藏' : '已取消收藏',
            icon: 'success'
        });
        
        // TODO: 同步到服务器
    },

    // 查看用户主页
    viewProfile() {
        wx.showToast({
            title: '用户主页功能开发中',
            icon: 'none'
        });
        // TODO: 跳转到用户主页
    },

    // 查看其他任务
    viewTask(e) {
        const id = e.currentTarget.dataset.id;
        wx.redirectTo({
            url: `/pages/detail/detail?id=${id}`
        });
    },

    // 预览图片
    previewImage(e) {
        const url = e.currentTarget.dataset.url;
        const { images } = this.data.task;
        
        wx.previewImage({
            current: url,
            urls: images || [url]
        });
    },

    // 分享配置
    onShareAppMessage() {
        const { task } = this.data;
        return {
            title: task.title,
            path: `/pages/detail/detail?id=${task.id}`,
            imageUrl: task.images && task.images[0] || ''
        };
    },

    onShareTimeline() {
        const { task } = this.data;
        return {
            title: `【邻里圈】${task.title}`,
            query: `id=${task.id}`,
            imageUrl: task.images && task.images[0] || ''
        };
    }
});
