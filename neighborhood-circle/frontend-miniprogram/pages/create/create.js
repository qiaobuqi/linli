import { request } from '../../utils/request';

Page({
    data: {
        title: '',
        description: '',
        price: ''
    },

    handleInput(e) {
        const field = e.currentTarget.dataset.field;
        this.setData({
            [field]: e.detail.value
        });
    },

    submitForm() {
        const { title, description, price } = this.data;
        if (!title || !price) {
            wx.showToast({ title: 'Please fill required fields', icon: 'none' });
            return;
        }

        request({
            url: '/tasks',
            method: 'POST',
            data: {
                title,
                description,
                price: parseFloat(price)
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
