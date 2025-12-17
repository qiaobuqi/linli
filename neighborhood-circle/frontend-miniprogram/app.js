import { request } from './utils/request';

App({
    onLaunch() {
        // 自动登录
        this.checkAndLogin();
    },
    
    globalData: {
        userInfo: null
    },
    
    // 检查并登录
    checkAndLogin() {
        const token = wx.getStorageSync('token');
        if (!token) {
            // 没有token，执行微信登录
            this.doWechatLogin();
        } else {
            // 有token，验证是否有效（可选）
            console.log('已有token:', token);
        }
    },
    
    // 执行微信登录
    doWechatLogin() {
        wx.login({
            success: (res) => {
                if (res.code) {
                    console.log('微信登录成功，code:', res.code);
                    // 调用后端登录接口
                    request({
                        url: '/auth/wechat-login',
                        method: 'POST',
                        data: {
                            code: res.code
                        },
                        noAuth: true // 登录接口不需要token
                    }).then(loginRes => {
                        console.log('后端登录成功:', loginRes);
                        // 保存token
                        if (loginRes.token) {
                            wx.setStorageSync('token', loginRes.token);
                            if (loginRes.user) {
                                this.globalData.userInfo = loginRes.user;
                            }
                            console.log('Token已保存');
                        }
                    }).catch(err => {
                        console.error('后端登录失败:', err);
                        wx.showToast({
                            title: '登录失败，请重试',
                            icon: 'none'
                        });
                    });
                } else {
                    console.error('微信登录失败:', res.errMsg);
                }
            },
            fail: (err) => {
                console.error('wx.login调用失败:', err);
            }
        });
    }
})
