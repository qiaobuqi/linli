import { request } from '../../utils/request';

const app = getApp();

Page({
    data: {
        userInfo: null,
        hasUserInfo: false,
        creditLevel: '优秀',
        creditProgress: 75,
        
        // 成就列表
        achievements: [
            { id: 1, icon: '🌟', name: '新手上路', desc: '完成首次任务', unlocked: true },
            { id: 2, icon: '🤝', name: '热心邻居', desc: '帮助5位邻居', unlocked: true },
            { id: 3, icon: '💪', name: '任务达人', desc: '完成10个任务', unlocked: false },
            { id: 4, icon: '🏆', name: '金牌助手', desc: '获得20个好评', unlocked: false },
            { id: 5, icon: '👑', name: '社区之星', desc: '信用分达到150', unlocked: false }
        ]
    },

    onLoad() {
        this.loadUserInfo();
    },

    onShow() {
        // 每次显示时刷新用户信息
        if (this.data.hasUserInfo) {
            this.loadUserInfo();
        }
    },

    // 加载用户信息
    loadUserInfo() {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            const userData = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
            
            // 计算信用等级
            const creditScore = userData.creditScore || 100;
            const creditLevel = this.calculateCreditLevel(creditScore);
            const creditProgress = this.calculateCreditProgress(creditScore);
            
            this.setData({
                userInfo: userData,
                hasUserInfo: true,
                creditLevel,
                creditProgress
            });
        } else {
            this.setData({
                hasUserInfo: false
            });
        }
    },

    // 计算信用等级
    calculateCreditLevel(score) {
        if (score >= 150) return '极好';
        if (score >= 120) return '优秀';
        if (score >= 100) return '良好';
        if (score >= 80) return '一般';
        return '较差';
    },

    // 计算信用进度
    calculateCreditProgress(score) {
        // 以150分为满分
        return Math.min((score / 150) * 100, 100);
    },

    // 登录
    handleLogin() {
        wx.showLoading({ title: '登录中...', mask: true });

        // 1. 获取用户信息（Mock）
        const mockUserInfo = {
            nickName: '邻里圈用户',
            avatarUrl: 'https://placekitten.com/200/200'
        };

        // 2. 微信登录
        wx.login({
            success: res => {
                if (res.code) {
                    // 3. 调用后端接口
                    request({
                        url: '/auth/wechat-login',
                        method: 'POST',
                        data: {
                            code: res.code,
                            userInfo: mockUserInfo
                        }
                    }).then(loginRes => {
                        wx.hideLoading();
                        console.log('登录成功', loginRes);
                        
                        // 保存token和用户信息
                        wx.setStorageSync('token', loginRes.token);
                        wx.setStorageSync('userInfo', JSON.stringify(loginRes.user));

                        // 更新页面数据
                        this.loadUserInfo();
                        
                        wx.showToast({ 
                            title: '登录成功！', 
                            icon: 'success' 
                        });
                    }).catch(err => {
                        wx.hideLoading();
                        console.error('登录失败:', err);
                        wx.showToast({ 
                            title: '登录失败，请重试', 
                            icon: 'none' 
                        });
                    });
                } else {
                    wx.hideLoading();
                    wx.showToast({ 
                        title: '登录失败', 
                        icon: 'none' 
                    });
                }
            },
            fail: () => {
                wx.hideLoading();
                wx.showToast({ 
                    title: '登录失败', 
                    icon: 'none' 
                });
            }
        });
    },

    // 退出登录
    handleLogout() {
        wx.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            confirmText: '确定',
            cancelText: '取消',
            success: (res) => {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    this.setData({
                        userInfo: null,
                        hasUserInfo: false
                    });
                    wx.showToast({ 
                        title: '已退出登录', 
                        icon: 'success' 
                    });
                }
            }
        });
    },

    // 查看我的任务
    viewMyTasks(e) {
        const type = e.currentTarget.dataset.type;
        wx.showToast({
            title: `查看${type === 'published' ? '发布' : type === 'claimed' ? '接单' : '完成'}的任务`,
            icon: 'none'
        });
        // TODO: 跳转到任务列表页
    },

    // 查看收藏
    viewCollections() {
        wx.showToast({
            title: '查看收藏',
            icon: 'none'
        });
        // TODO: 跳转到收藏列表页
    },

    // 查看信用详情
    viewCreditDetail() {
        wx.showToast({
            title: '信用详情功能开发中',
            icon: 'none'
        });
        // TODO: 跳转到信用详情页
    },

    // 钱包管理
    manageWallet() {
        wx.showToast({
            title: '钱包管理功能开发中',
            icon: 'none'
        });
        // TODO: 跳转到钱包管理页
    },

    // 充值
    recharge() {
        wx.showToast({
            title: '充值功能开发中',
            icon: 'none'
        });
        // TODO: 实现充值功能
    },

    // 提现
    withdraw() {
        wx.showToast({
            title: '提现功能开发中',
            icon: 'none'
        });
        // TODO: 实现提现功能
    },

    // 查看交易明细
    viewTransactions() {
        wx.showToast({
            title: '交易明细功能开发中',
            icon: 'none'
        });
        // TODO: 跳转到交易明细页
    },

    // 查看所有成就
    viewAllAchievements() {
        wx.showToast({
            title: '成就系统功能开发中',
            icon: 'none'
        });
        // TODO: 跳转到成就列表页
    },

    // 通用导航
    navigateTo(e) {
        const url = e.currentTarget.dataset.url;
        wx.showToast({
            title: '功能开发中',
            icon: 'none'
        });
        // TODO: 实现页面跳转
        // wx.navigateTo({ url });
    },

    // 查看社区公约
    viewRules() {
        wx.showToast({
            title: '社区公约功能开发中',
            icon: 'none'
        });
        // TODO: 显示社区公约
    },

    // 联系客服
    contactService() {
        wx.showToast({
            title: '客服功能开发中',
            icon: 'none'
        });
        // TODO: 实现客服功能
    },

    // 使用帮助
    viewHelp() {
        wx.showToast({
            title: '帮助中心功能开发中',
            icon: 'none'
        });
        // TODO: 显示帮助文档
    }
});
