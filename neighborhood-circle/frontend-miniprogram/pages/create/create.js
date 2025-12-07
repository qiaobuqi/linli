import { request } from '../../utils/request';

Page({
    data: {
        title: '',
        description: '',
        price: '',
        type: 'express', // Default type
        types: ['express', 'professional', 'emergency']
    },

    handleTypeChange(e) {
        this.setData({
            type: this.data.types[e.detail.value]
        });
    },

    handleInput(e) {
        const field = e.currentTarget.dataset.field;
        this.setData({
            [field]: e.detail.value
        });
    },

    submitForm() {
        const { title, description, price, type } = this.data;
        if (!title || !price) {
            wx.showToast({ title: 'Please fill required fields', icon: 'none' });
            return;
        }

        // Mock GPS
        const mockLat = 31.2304;
        const mockLong = 121.4737;

        request({
            url: '/tasks',
            method: 'POST',
            data: {
                title,
                description,
                price: parseFloat(price),
                type,
                latitude: mockLat,
                longitude: mockLong,
                urgency: false
            }
        }).then(res => {
            wx.showToast({ title: 'Created!', icon: 'success' });
            setTimeout(() => {
                wx.switchTab({ url: '/pages/index/index' });
            }, 1500);
        }).catch(err => {
            wx.showToast({ title: 'Error creating task', icon: 'none' });
        });
    }
});
