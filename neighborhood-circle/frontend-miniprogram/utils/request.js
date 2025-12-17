const BASE_URL = 'https://wx.cnirv.com/api/v1'; // Local Dev Backend (开发环境)

export const request = (options) => {
    return new Promise((resolve, reject) => {
        // Token Injection & LBS
        const header = options.header || {};
        
        // 如果不是noAuth请求，则添加token
        if (!options.noAuth) {
            const token = wx.getStorageSync('token');
            if (token) {
                header['Authorization'] = `Bearer ${token}`;
            }
        }

        // Auto-inject Mock GPS for Neighborhood LBS
        // In real app: wx.getLocation()
        const mockLat = '31.2304';
        const mockLong = '121.4737';

        let url = options.url.startsWith('http') ? options.url : BASE_URL + options.url;
        if (options.method === 'GET' && !url.includes('lat=')) {
            const separator = url.includes('?') ? '&' : '?';
            url += `${separator}lat=${mockLat}&long=${mockLong}`;
        }

        // 3. Network Request
        wx.request({
            url: url,
            method: options.method || 'GET',
            data: options.data || {},
            header: header,
            success: (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data);
                } else {
                    if (res.statusCode === 401) {
                        wx.removeStorageSync('token');
                        wx.showToast({ title: 'Session expired', icon: 'none' });
                        // Redirect to login logic if needed
                    }
                    reject(res);
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};
