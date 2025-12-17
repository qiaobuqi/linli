import { request } from '../../utils/request';

Page({
    data: {
        tasks: [],
        loading: true,
        currentCategory: 'all',
        banners: [
            { type: 'pet', title: '宠物照顾', subtitle: '让爱宠得到最好的陪伴', emoji: '🐕' },
            { type: 'carpool', title: '顺风车', subtitle: '同路上下班，绿色又省钱', emoji: '🚗' },
            { type: 'secondhand', title: '二手好物', subtitle: '邻里之间，闲置互换', emoji: '♻️' }
        ],
        categories: [
            { type: 'express', name: '代取快递', emoji: '📦', count: 8 },
            { type: 'pet', name: '宠物照顾', emoji: '🐕', count: 12 },
            { type: 'carpool', name: '顺风车', emoji: '🚗', count: 6 },
            { type: 'secondhand', name: '二手市场', emoji: '♻️', count: 15 },
            { type: 'repair', name: '维修服务', emoji: '🔧', count: 5 },
            { type: 'cleaning', name: '保洁服务', emoji: '🧹', count: 4 },
            { type: 'food', name: '美食分享', emoji: '🍜', count: 9 },
            { type: 'other', name: '其他帮助', emoji: '💡', count: 3 }
        ],
        hotTags: ['遛狗', '代收快递', '上班顺路', '家具转让', '水管维修', '小区拼团']
    },

    onLoad() {
        this.fetchTasks();
    },

    onShow() {
        // 每次显示页面时刷新数据
        if (!this.data.loading) {
            this.fetchTasks();
        }
    },

    onPullDownRefresh() {
        this.fetchTasks(() => {
            wx.stopPullDownRefresh();
        });
    },

    fetchTasks(cb) {
        this.setData({ loading: true });
        
        request({
            url: '/tasks',
            method: 'GET'
        }).then(res => {
            // 为每个任务添加类型相关的emoji和中文名称
            const tasksWithMeta = res.map(task => {
                const category = this.data.categories.find(cat => cat.type === task.type) || 
                                this.data.categories.find(cat => cat.type === 'other');
                return Object.assign({}, task, {
                    typeEmoji: category.emoji,
                    typeName: category.name
                });
            });
            
            this.setData({
                tasks: tasksWithMeta,
                loading: false
            });
            if (cb) cb();
        }).catch(err => {
            console.error(err);
            this.setData({ loading: false });
            wx.showToast({ 
                title: '加载失败', 
                icon: 'none' 
            });
            if (cb) cb();
        });
    },

    filterByCategory(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({ currentCategory: type });
        
        wx.showToast({
            title: `筛选: ${type}`,
            icon: 'none'
        });
        
        // TODO: 实现实际的筛选逻辑
        // 可以调用带参数的API或者前端过滤
    },

    filterByTag(e) {
        const tag = e.currentTarget.dataset.tag;
        wx.showToast({
            title: `搜索: #${tag}`,
            icon: 'none'
        });
        // TODO: 实现标签搜索
    },

    onSearch() {
        wx.showToast({
            title: '搜索功能开发中',
            icon: 'none'
        });
        // TODO: 跳转到搜索页面
    },

    viewMore() {
        wx.showToast({
            title: '查看更多',
            icon: 'none'
        });
        // TODO: 跳转到列表页或加载更多
    },

    goToDetail(e) {
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/detail/detail?id=${id}`,
        });
    },

    goToCreate() {
        wx.switchTab({
            url: '/pages/create/create',
        });
    }
});
