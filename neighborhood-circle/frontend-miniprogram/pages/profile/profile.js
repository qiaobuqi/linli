import { request } from '../../utils/request';

const app = getApp();

Page({
    data: {
        userInfo: null,
        hasUserInfo: false
    },

    onLoad() {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData({
                userInfo: JSON.parse(userInfo),
                hasUserInfo: true
            });
        }
    },

    handleLogin() {
        // 1. Get User Profile (Mock if needed)
        // In real minimal program, use wx.getUserProfile
        const mockUserInfo = {
            nickName: 'Max_User',
            avatarUrl: 'https://placekitten.com/100/100'
        };

        // 2. wx.login to get code
        wx.login({
            success: res => {
                if (res.code) {
                    // 3. Call Backend
                    request({
                        url: '/auth/wechat-login',
                        method: 'POST',
                        data: {
                            code: res.code,
                            userInfo: mockUserInfo
                        }
                    }).then(loginRes => {
                        console.log('Login success', loginRes);
                        wx.setStorageSync('token', loginRes.token);
                        wx.setStorageSync('userInfo', JSON.stringify(loginRes.user));

                        this.setData({
                            userInfo: loginRes.user,
                            hasUserInfo: true
                        });
                        wx.showToast({ title: 'Logged In' });
                    });
                }
            }
        });
    },

    handleLogout() {
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        this.setData({
            userInfo: null,
            hasUserInfo: false
        });
    }
});
