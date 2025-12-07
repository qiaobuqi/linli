import { request } from '../../utils/request';

Page({
    data: {
        tasks: [],
        loading: true
    },

    onLoad() {
        this.fetchTasks();
    },

    onPullDownRefresh() {
        this.fetchTasks(() => {
            wx.stopPullDownRefresh();
        });
    },

    fetchTasks(cb) {
        request({
            url: '/tasks',
            method: 'GET'
        }).then(res => {
            this.setData({
                tasks: res,
                loading: false
            });
            if (cb) cb();
        }).catch(err => {
            console.error(err);
            this.setData({ loading: false });
            if (cb) cb();
        });
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
