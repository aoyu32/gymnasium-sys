// 器材mock数据
export const equipments = [
    {
        id: 1,
        name: '篮球',
        description: '标准7号篮球，适合室内外使用',
        category: 'ball',
        stock: 15,
        total: 20,
        condition: 'good',
        conditionText: '状态良好',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
        brands: [
            { id: 1, name: '斯伯丁', model: 'NBA官方用球', stock: 8 },
            { id: 2, name: '威尔胜', model: 'Evolution系列', stock: 7 }
        ]
    },
    {
        id: 2,
        name: '羽毛球拍',
        description: '碳纤维球拍，轻便耐用',
        category: 'racket',
        stock: 12,
        total: 15,
        condition: 'good',
        conditionText: '状态良好',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
        brands: [
            { id: 1, name: '尤尼克斯', model: 'NANORAY系列', stock: 6 },
            { id: 2, name: '李宁', model: 'N90系列', stock: 6 }
        ]
    },
    {
        id: 3,
        name: '乒乓球拍',
        description: '专业乒乓球拍套装',
        category: 'racket',
        stock: 0,
        total: 10,
        condition: 'good',
        conditionText: '状态良好',
        image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400',
        brands: [
            { id: 1, name: '红双喜', model: '狂飙系列', stock: 0 }
        ]
    },
    {
        id: 4,
        name: '足球',
        description: '标准5号足球，FIFA认证',
        category: 'ball',
        stock: 10,
        total: 15,
        condition: 'good',
        conditionText: '状态良好',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
        brands: [
            { id: 1, name: '阿迪达斯', model: '世界杯用球', stock: 5 },
            { id: 2, name: '耐克', model: 'Premier系列', stock: 5 }
        ]
    },
    {
        id: 5,
        name: '排球',
        description: '标准比赛用排球',
        category: 'ball',
        stock: 8,
        total: 10,
        condition: 'good',
        conditionText: '状态良好',
        image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400',
        brands: [
            { id: 1, name: '米卡萨', model: 'MVA200', stock: 8 }
        ]
    },
    {
        id: 6,
        name: '网球拍',
        description: '专业网球拍，适合初学者',
        category: 'racket',
        stock: 6,
        total: 8,
        condition: 'good',
        conditionText: '状态良好',
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
        brands: [
            { id: 1, name: '威尔胜', model: 'Pro Staff系列', stock: 3 },
            { id: 2, name: '海德', model: 'Radical系列', stock: 3 }
        ]
    },
    {
        id: 7,
        name: '护膝',
        description: '运动护膝，保护膝盖',
        category: 'protection',
        stock: 20,
        total: 25,
        condition: 'good',
        conditionText: '状态良好',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
        brands: [
            { id: 1, name: 'LP', model: '专业护膝', stock: 10 },
            { id: 2, name: '迈克达威', model: '运动护膝', stock: 10 }
        ]
    },
    {
        id: 8,
        name: '护腕',
        description: '运动护腕，防止扭伤',
        category: 'protection',
        stock: 15,
        total: 20,
        condition: 'good',
        conditionText: '状态良好',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
        brands: [
            { id: 1, name: 'LP', model: '专业护腕', stock: 15 }
        ]
    },
    {
        id: 9,
        name: '跳绳',
        description: '专业训练跳绳',
        category: 'other',
        stock: 25,
        total: 30,
        condition: 'good',
        conditionText: '状态良好',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        brands: [
            { id: 1, name: '李宁', model: '竞速跳绳', stock: 25 }
        ]
    }
]
