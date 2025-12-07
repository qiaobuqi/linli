import { request } from '../../utils/request';

Page({
    data: {
        task: null,
        loading: true
    },

    onLoad(options) {
        if (options.id) {
            this.fetchDetail(options.id);
        }
    },

    fetchDetail(id) {
        request({
            url: `/tasks/${id}`
        }).then(res => {
            this.setData({
                task: res,
                loading: false
            });
        }).catch(err => {
            wx.showToast({ title: 'Fetch failed', icon: 'none' });
        });
    },

    claimTask() {
        wx.showToast({ title: 'Task Claimed!', icon: 'success' });
        // TODO: Implement claim logic
    }
});
