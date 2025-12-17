import { request } from '../../utils/request';

Page({
    data: {
        title: '',
        description: '',
        price: '',
        selectedType: 'express',
        urgency: false,
        location: '阳光花园小区',
        images: [],
        priceMode: 'quick', // 'quick' or 'custom'
        
        // 服务类型配置
        serviceTypes: [
            { value: 'express', label: '代取快递', emoji: '📦' },
            { value: 'pet', label: '宠物照顾', emoji: '🐕' },
            { value: 'carpool', label: '顺风车', emoji: '🚗' },
            { value: 'secondhand', label: '二手买卖', emoji: '♻️' },
            { value: 'repair', label: '维修服务', emoji: '🔧' },
            { value: 'cleaning', label: '保洁服务', emoji: '🧹' },
            { value: 'food', label: '美食分享', emoji: '🍜' },
            { value: 'other', label: '其他帮助', emoji: '💡' }
        ],

        // 不同类型的标题占位符
        typePlaceholders: {
            express: '例如：帮忙取个快递',
            pet: '例如：周末帮忙遛狗2小时',
            carpool: '例如：明天早8点去望京上班求顺风',
            secondhand: '例如：转让九成新宜家书架',
            repair: '例如：水龙头漏水需要维修',
            cleaning: '例如：周末大扫除需要帮手',
            food: '例如：自制蛋糕分享',
            other: '例如：需要借梯子用一下'
        },

        // 不同类型的描述占位符
        typeDescPlaceholders: {
            express: '说明快递位置、时间要求等详细信息',
            pet: '介绍宠物品种、性格、注意事项等',
            carpool: '详细说明出发地点、目的地、时间等',
            secondhand: '描述物品状况、购买时间、转让原因等',
            repair: '详细描述故障情况、位置、方便上门时间',
            cleaning: '说明清洁范围、面积、特殊要求等',
            food: '介绍美食种类、份量、取餐时间等',
            other: '详细描述你的需求'
        },

        // 快速报酬选项
        quickPrices: [10, 20, 30, 50, 80, 100]
    },

    onLoad() {
        // 页面加载
    },

    // 选择服务类型
    selectType(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({
            selectedType: type
        });
    },

    // 输入处理
    handleInput(e) {
        const field = e.currentTarget.dataset.field;
        this.setData({
            [field]: e.detail.value
        });
    },

    // 切换报酬模式
    setPriceMode(e) {
        const mode = e.currentTarget.dataset.mode;
        this.setData({
            priceMode: mode,
            price: '' // 切换模式时清空价格
        });
    },

    // 选择快速报酬
    selectQuickPrice(e) {
        const price = e.currentTarget.dataset.price;
        this.setData({
            price: price.toString()
        });
    },

    // 切换加急状态
    toggleUrgency(e) {
        this.setData({
            urgency: !this.data.urgency
        });
    },

    // 选择位置
    chooseLocation() {
        wx.showToast({
            title: '位置选择功能开发中',
            icon: 'none'
        });
        // TODO: 实现地图选择位置功能
        // wx.chooseLocation({
        //     success: (res) => {
        //         this.setData({
        //             location: res.address,
        //             latitude: res.latitude,
        //             longitude: res.longitude
        //         });
        //     }
        // });
    },

    // 上传图片
    uploadImage() {
        wx.chooseImage({
            count: 3 - this.data.images.length,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const tempFilePaths = res.tempFilePaths;
                this.setData({
                    images: this.data.images.concat(tempFilePaths)
                });
                
                // TODO: 实际项目中需要上传到服务器
                wx.showToast({
                    title: '图片已添加',
                    icon: 'success'
                });
            }
        });
    },

    // 删除图片
    deleteImage(e) {
        const index = e.currentTarget.dataset.index;
        const images = this.data.images;
        images.splice(index, 1);
        this.setData({ images });
    },

    // 提交表单
    submitForm() {
        const { title, description, price, selectedType, urgency, images } = this.data;
        
        // 表单验证
        if (!title) {
            wx.showToast({ 
                title: '请填写标题', 
                icon: 'none' 
            });
            return;
        }

        if (!description) {
            wx.showToast({ 
                title: '请填写详细描述', 
                icon: 'none' 
            });
            return;
        }

        if (!price || parseFloat(price) <= 0) {
            wx.showToast({ 
                title: '请设置合理的报酬', 
                icon: 'none' 
            });
            return;
        }

        // 显示加载提示
        wx.showLoading({ 
            title: '发布中...',
            mask: true 
        });

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
                type: selectedType,
                latitude: mockLat,
                longitude: mockLong,
                urgency: urgency,
                images: images // 实际应该是上传后的图片URL
            }
        }).then(res => {
            wx.hideLoading();
            wx.showToast({ 
                title: '发布成功！', 
                icon: 'success',
                duration: 2000
            });
            
            setTimeout(() => {
                wx.switchTab({ url: '/pages/index/index' });
            }, 2000);
        }).catch(err => {
            wx.hideLoading();
            console.error('发布失败:', err);
            wx.showToast({ 
                title: '发布失败，请重试', 
                icon: 'none' 
            });
        });
    }
});
