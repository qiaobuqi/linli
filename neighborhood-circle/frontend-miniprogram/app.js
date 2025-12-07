import { request } from './utils/request';

App({
    onLaunch() {
        // Check login status
        const token = wx.getStorageSync('token');
        if (!token) {
            // Do login logic if needed automatically, or let user trigger it
        }
    },
    globalData: {
        userInfo: null
    }
})
