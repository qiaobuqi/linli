export const mocks = {
    'GET /api/v1/tasks': [
        {
            id: 1,
            title: 'Walk my dog',
            description: 'Need someone to walk my golden retriever for 30 mins.',
            price: 20.0,
            status: 'pending',
            creator: { nickname: 'Alice', avatar_url: 'https://placekitten.com/50/50' }
        },
        {
            id: 2,
            title: 'Fix leaked tap',
            description: 'Kitchen tap is leaking, need a plumber.',
            price: 150.0,
            status: 'claimed',
            creator: { nickname: 'Bob', avatar_url: 'https://placekitten.com/51/51' }
        }
    ],
    'GET /api/v1/tasks/1': {
        id: 1,
        title: 'Walk my dog',
        description: 'Need someone to walk my golden retriever for 30 mins.',
        price: 20.0,
        status: 'pending',
        creator: { nickname: 'Alice', avatar_url: 'https://placekitten.com/50/50' },
        created_at: '2023-10-01T10:00:00Z'
    },
    'POST /api/v1/auth/wechat-login': {
        token: 'mock_token_12345',
        user: {
            id: 1,
            nickname: 'Max',
            avatar_url: 'https://placekitten.com/52/52'
        }
    },
    'POST /api/v1/tasks': {
        id: 3,
        title: 'New Task',
        status: 'pending'
    }
};
