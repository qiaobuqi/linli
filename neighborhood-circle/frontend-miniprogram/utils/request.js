import { mocks } from './mock';

const BASE_URL = 'http://localhost:8080/api/v1'; // Local Dev Backend
const USE_MOCK = true; // Toggle Mock Data

export const request = (options) => {
    return new Promise((resolve, reject) => {
        // 1. Mock Data Handling
        const mockKey = `${options.method || 'GET'} ${options.url.replace(BASE_URL, '')}`;
        // Simpler matching for mock (stripping base url if passed relative)
        const relativeUrl = options.url.startsWith('http') ? options.url : options.url;
        const key = `${options.method || 'GET'} ${relativeUrl}`;

        if (USE_MOCK) {
            // Check for exact match or simple pattern match could go here
            // For this demo, we check directly in the mocks object
            if (mocks[key]) {
                console.log(`[Mock] ${key}`, mocks[key]);
                setTimeout(() => {
                    resolve(mocks[key]);
                }, 500);
                return;
            }
            // Fallthrough if mock not found, or maybe just log it
            console.log(`[Mock] Not found for ${key}, falling back to network if possible or rejecting`);
        }

        // 2. Token Injection
        const header = options.header || {};
        const token = wx.getStorageSync('token');
        if (token) {
            header['Authorization'] = `Bearer ${token}`;
        }

        // 3. Network Request
        wx.request({
            url: options.url.startsWith('http') ? options.url : BASE_URL + options.url,
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
