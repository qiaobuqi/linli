// 生成随机时间（最近7天内）
function getRandomRecentDate() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    now.setDate(now.getDate() - daysAgo);
    now.setHours(now.getHours() - hoursAgo);
    return now.toISOString();
}

// Mock用户数据
const mockUsers = [
    { id: 1, nickname: '热心的小张', avatar_url: 'https://i.pravatar.cc/150?img=1', level: 5, creditScore: 135, verified: true, tags: ['靠谱', '速度快', '热心'] },
    { id: 2, nickname: '邻家小李', avatar_url: 'https://i.pravatar.cc/150?img=2', level: 3, creditScore: 110, verified: true, tags: ['友好', '细心'] },
    { id: 3, nickname: '爱心妈妈', avatar_url: 'https://i.pravatar.cc/150?img=5', level: 4, creditScore: 125, verified: true, tags: ['有爱心', '耐心'] },
    { id: 4, nickname: '修理工老王', avatar_url: 'https://i.pravatar.cc/150?img=12', level: 6, creditScore: 145, verified: true, tags: ['专业', '经验丰富'] },
    { id: 5, nickname: '大学生小陈', avatar_url: 'https://i.pravatar.cc/150?img=8', level: 2, creditScore: 100, verified: false, tags: ['勤快', '便宜'] },
    { id: 6, nickname: '上班族小刘', avatar_url: 'https://i.pravatar.cc/150?img=15', level: 3, creditScore: 115, verified: true, tags: ['准时', '顺路'] },
    { id: 7, nickname: '宠物达人', avatar_url: 'https://i.pravatar.cc/150?img=23', level: 5, creditScore: 130, verified: true, tags: ['爱宠物', '专业'] },
    { id: 8, nickname: '美食博主', avatar_url: 'https://i.pravatar.cc/150?img=29', level: 4, creditScore: 120, verified: true, tags: ['手艺好', '分享'] }
];

// Mock任务列表
const mockTasks = [
    // 代取快递
    {
        id: 1,
        title: '帮忙取个菜鸟驿站的快递',
        description: '我今天加班，菜鸟驿站6点就关门了，麻烦帮我取一下快递，取货码：6688。驿站在小区东门，我住在3号楼。',
        price: 10.0,
        status: 'pending',
        type: 'express',
        urgency: false,
        viewCount: 12,
        applicantCount: 2,
        latitude: 31.2310,
        longitude: 121.4740,
        distance: '300m',
        creator: mockUsers[0],
        created_at: getRandomRecentDate()
    },
    {
        id: 2,
        title: '代收京东快递，明天送达',
        description: '明天有个京东快递送达，但是我要出差，麻烦帮我代收一下，回来给您送过去！',
        price: 15.0,
        status: 'pending',
        type: 'express',
        urgency: true,
        viewCount: 8,
        applicantCount: 1,
        latitude: 31.2305,
        longitude: 121.4735,
        distance: '150m',
        creator: mockUsers[1],
        created_at: getRandomRecentDate()
    },
    
    // 宠物照顾
    {
        id: 3,
        title: '周末帮忙遛狗2小时',
        description: '家里的金毛很乖，需要有人周末帮忙遛狗，时间是下午3-5点。狗狗很温顺，不咬人，希望找个喜欢狗狗的朋友！',
        price: 50.0,
        status: 'pending',
        type: 'pet',
        urgency: false,
        viewCount: 25,
        applicantCount: 5,
        latitude: 31.2315,
        longitude: 121.4745,
        distance: '400m',
        creator: mockUsers[2],
        created_at: getRandomRecentDate(),
        images: ['https://images.unsplash.com/photo-1633526543814-9616168b92a9?w=400']
    },
    {
        id: 4,
        title: '急需寄养小猫3天',
        description: '突然要出差3天，家里小猫需要人照顾，猫粮猫砂都准备好了。猫很乖，不用太操心，主要是喂食换水就行。',
        price: 100.0,
        status: 'claimed',
        type: 'pet',
        urgency: true,
        viewCount: 18,
        applicantCount: 3,
        latitude: 31.2308,
        longitude: 121.4738,
        distance: '200m',
        creator: mockUsers[6],
        created_at: getRandomRecentDate(),
        images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400']
    },
    
    // 顺风车
    {
        id: 5,
        title: '明早8点去望京上班求顺风',
        description: '明天早上8点从小区出发去望京SOHO上班，求顺风车！可以给油费和早餐钱～',
        price: 30.0,
        status: 'pending',
        type: 'carpool',
        urgency: false,
        viewCount: 15,
        applicantCount: 2,
        latitude: 31.2312,
        longitude: 121.4742,
        distance: '100m',
        creator: mockUsers[5],
        created_at: getRandomRecentDate()
    },
    {
        id: 6,
        title: '每天下午5点从中关村回小区',
        description: '长期拼车，每天下午5点左右从中关村回小区，可以固定拼车，AA油费。',
        price: 25.0,
        status: 'pending',
        type: 'carpool',
        urgency: false,
        viewCount: 32,
        applicantCount: 4,
        latitude: 31.2318,
        longitude: 121.4748,
        distance: '500m',
        creator: mockUsers[1],
        created_at: getRandomRecentDate()
    },
    
    // 二手买卖
    {
        id: 7,
        title: '转让九成新宜家书架',
        description: '搬家了，转让宜家书架一个，九成新，原价299元，现在100元转让。需要自提，我可以帮忙搬到楼下。',
        price: 100.0,
        status: 'pending',
        type: 'secondhand',
        urgency: false,
        viewCount: 45,
        applicantCount: 8,
        latitude: 31.2320,
        longitude: 121.4750,
        distance: '600m',
        creator: mockUsers[3],
        created_at: getRandomRecentDate(),
        images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400']
    },
    {
        id: 8,
        title: '儿童自行车转让，适合3-6岁',
        description: '孩子大了不骑了，八成新的儿童自行车转让，品牌是迪卡侬，质量很好。原价388，现价150。',
        price: 150.0,
        status: 'pending',
        type: 'secondhand',
        urgency: false,
        viewCount: 28,
        applicantCount: 3,
        latitude: 31.2306,
        longitude: 121.4736,
        distance: '250m',
        creator: mockUsers[2],
        created_at: getRandomRecentDate(),
        images: ['https://images.unsplash.com/photo-1608707434215-42e5c43b2eeb?w=400']
    },
    
    // 维修服务
    {
        id: 9,
        title: '厨房水龙头漏水需要修理',
        description: '厨房水龙头漏水很严重，需要专业师傅来修理一下。最好今天或明天能来，谢谢！',
        price: 80.0,
        status: 'pending',
        type: 'repair',
        urgency: true,
        viewCount: 20,
        applicantCount: 2,
        latitude: 31.2314,
        longitude: 121.4744,
        distance: '350m',
        creator: mockUsers[4],
        created_at: getRandomRecentDate()
    },
    {
        id: 10,
        title: '电脑系统重装和软件安装',
        description: '电脑很卡，想重装系统和安装一些办公软件，求懂电脑的朋友帮忙。可以上门或者我送到您家里。',
        price: 100.0,
        status: 'completed',
        type: 'repair',
        urgency: false,
        viewCount: 16,
        applicantCount: 1,
        latitude: 31.2311,
        longitude: 121.4741,
        distance: '280m',
        creator: mockUsers[7],
        created_at: getRandomRecentDate(),
        reviews: [
            {
                id: 1,
                name: '修理工老王',
                avatar: mockUsers[3].avatar_url,
                rating: 5,
                content: '服务很好，很专业，电脑速度快多了！强烈推荐！',
                time: '2天前'
            }
        ]
    },
    
    // 保洁服务
    {
        id: 11,
        title: '周末大扫除需要帮手',
        description: '家里太久没打扫了，周末想做个大扫除，需要一个帮手一起，预计3-4小时。主要是擦窗户、拖地等。',
        price: 120.0,
        status: 'pending',
        type: 'cleaning',
        urgency: false,
        viewCount: 22,
        applicantCount: 4,
        latitude: 31.2309,
        longitude: 121.4739,
        distance: '220m',
        creator: mockUsers[0],
        created_at: getRandomRecentDate()
    },
    
    // 美食分享
    {
        id: 12,
        title: '自制蛋糕分享，免费送',
        description: '做了太多蛋糕，吃不完想分享给邻居，有红丝绒和提拉米苏，免费送！先到先得～',
        price: 0.0,
        status: 'pending',
        type: 'food',
        urgency: false,
        viewCount: 88,
        applicantCount: 15,
        latitude: 31.2316,
        longitude: 121.4746,
        distance: '450m',
        creator: mockUsers[7],
        created_at: getRandomRecentDate(),
        images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400']
    },
    {
        id: 13,
        title: '小区拼团买水果，还差2人',
        description: '在生鲜平台拼团买水果，现在还差2人成团，价格超实惠！有兴趣的邻居快来～',
        price: 0.0,
        status: 'pending',
        type: 'food',
        urgency: true,
        viewCount: 35,
        applicantCount: 6,
        latitude: 31.2307,
        longitude: 121.4737,
        distance: '180m',
        creator: mockUsers[1],
        created_at: getRandomRecentDate()
    },
    
    // 其他帮助
    {
        id: 14,
        title: '借梯子用一下，半小时归还',
        description: '需要换灯泡，想借个梯子用一下，半小时内归还。就在同一栋楼，非常近！',
        price: 0.0,
        status: 'pending',
        type: 'other',
        urgency: false,
        viewCount: 8,
        applicantCount: 2,
        latitude: 31.2313,
        longitude: 121.4743,
        distance: '320m',
        creator: mockUsers[5],
        created_at: getRandomRecentDate()
    },
    {
        id: 15,
        title: '帮忙教小朋友作业，数学',
        description: '孩子五年级，数学题不会做，求数学好的朋友帮忙辅导一下，大概1小时。可以线上或者上门。',
        price: 80.0,
        status: 'pending',
        type: 'other',
        urgency: false,
        viewCount: 19,
        applicantCount: 3,
        latitude: 31.2319,
        longitude: 121.4749,
        distance: '550m',
        creator: mockUsers[2],
        created_at: getRandomRecentDate()
    }
];

// Mock 详情页数据（增强版）
const mockTaskDetails = {};
mockTasks.forEach(task => {
    mockTaskDetails[`GET /api/v1/tasks/${task.id}`] = {
        ...task,
        creator: {
            ...task.creator,
            publishCount: Math.floor(Math.random() * 20) + 5,
            completeCount: Math.floor(Math.random() * 15) + 3
        }
    };
});

// Mock 用户登录
const mockUserInfo = {
    id: 100,
    nickname: '邻里圈用户',
    avatar_url: 'https://i.pravatar.cc/150?img=68',
    level: 3,
    experience: 850,
    creditScore: 115,
    balance: 268.50,
    frozenBalance: 50.00,
    publishCount: 8,
    claimCount: 12,
    completeCount: 10,
    collectCount: 5,
    verified: true,
    bio: '热心助人，诚信为本',
    tags: ['靠谱', '热心', '及时响应']
};

export const mocks = {
    // 任务列表
    'GET /api/v1/tasks': mockTasks,
    
    // 任务详情
    ...mockTaskDetails,
    
    // 用户登录
    'POST /api/v1/auth/wechat-login': {
        token: 'mock_token_' + Date.now(),
        user: mockUserInfo
    },
    
    // 创建任务
    'POST /api/v1/tasks': {
        id: Date.now(),
        title: '新任务',
        status: 'pending',
        created_at: new Date().toISOString()
    },
    
    // 接单
    'POST /api/v1/tasks/1/claim': {
        success: true,
        message: '接单成功'
    }
};
