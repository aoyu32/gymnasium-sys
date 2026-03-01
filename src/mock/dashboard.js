// 系统管理员数据看板 Mock 数据

// 统计数据
export const stats = {
    totalStudents: 1250,
    totalManagers: 15,
    totalEquipment: 580,
    totalPosts: 326
}

// 全馆使用率数据
export const venueUsageData = [
    { value: 85, name: '篮球馆' },
    { value: 72, name: '羽毛球馆' },
    { value: 68, name: '足球场' },
    { value: 55, name: '游泳馆' },
    { value: 48, name: '网球场' },
    { value: 42, name: '乒乓球馆' },
    { value: 38, name: '排球场' },
    { value: 35, name: '健身房' }
]

// 器材损耗分析数据
export const equipmentLossData = {
    categories: ['篮球', '足球', '羽毛球拍', '乒乓球拍', '护膝', '跳绳', '瑜伽垫'],
    series: [
        {
            name: '正常',
            data: [35, 20, 28, 18, 15, 25, 30]
        },
        {
            name: '轻微损耗',
            data: [10, 6, 8, 5, 3, 5, 8]
        },
        {
            name: '严重损耗',
            data: [3, 2, 3, 1, 1, 2, 1]
        },
        {
            name: '已报废',
            data: [2, 2, 1, 1, 1, 1, 1]
        }
    ]
}

// 生成近30天的使用趋势数据
export const generateUsageTrendData = () => {
    const dates = []
    const venueData = []
    const equipmentData = []
    const activityData = []

    for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        dates.push(`${date.getMonth() + 1}/${date.getDate()}`)

        // 生成有一定规律的随机数据
        // 周末数据会更高
        const isWeekend = date.getDay() === 0 || date.getDay() === 6
        const weekendBonus = isWeekend ? 30 : 0

        venueData.push(Math.floor(Math.random() * 40) + 100 + weekendBonus)
        equipmentData.push(Math.floor(Math.random() * 25) + 40 + weekendBonus * 0.5)
        activityData.push(Math.floor(Math.random() * 15) + 10 + weekendBonus * 0.3)
    }

    return {
        dates,
        series: [
            {
                name: '场地预约',
                data: venueData
            },
            {
                name: '器材借用',
                data: equipmentData
            },
            {
                name: '活动报名',
                data: activityData
            }
        ]
    }
}

// 活动类型分布数据
export const activityTypeData = [
    { value: 45, name: '篮球比赛' },
    { value: 38, name: '羽毛球训练' },
    { value: 32, name: '足球联赛' },
    { value: 28, name: '游泳课程' },
    { value: 25, name: '乒乓球赛' },
    { value: 22, name: '健身活动' },
    { value: 18, name: '瑜伽课程' },
    { value: 15, name: '排球比赛' },
    { value: 12, name: '网球训练' },
    { value: 10, name: '其他活动' }
]

// 最近注册学生
export const recentStudents = [
    {
        id: 1,
        name: '张三',
        studentId: '2026001',
        college: '计算机学院',
        registerTime: '2026-02-28 10:30'
    },
    {
        id: 2,
        name: '李四',
        studentId: '2026002',
        college: '软件学院',
        registerTime: '2026-02-28 11:00'
    },
    {
        id: 3,
        name: '王五',
        studentId: '2026003',
        college: '信息学院',
        registerTime: '2026-02-28 14:20'
    },
    {
        id: 4,
        name: '赵六',
        studentId: '2026004',
        college: '体育学院',
        registerTime: '2026-02-28 15:45'
    },
    {
        id: 5,
        name: '孙七',
        studentId: '2026005',
        college: '计算机学院',
        registerTime: '2026-03-01 09:15'
    }
]

// 待审核帖子
export const pendingPosts = [
    {
        id: 1,
        title: '篮球技巧分享：如何提高投篮命中率',
        author: '王五',
        category: '篮球',
        createTime: '2026-03-01 10:30'
    },
    {
        id: 2,
        title: '羽毛球入门指南',
        author: '赵六',
        category: '羽毛球',
        createTime: '2026-03-01 11:00'
    },
    {
        id: 3,
        title: '足球战术分析',
        author: '孙七',
        category: '足球',
        createTime: '2026-03-01 14:30'
    }
]

// 场馆详细使用数据
export const venueDetailData = [
    {
        id: 1,
        name: '篮球馆',
        totalHours: 168, // 一周总小时数
        usedHours: 143,
        usageRate: 85,
        bookingCount: 156,
        popularTime: '18:00-21:00'
    },
    {
        id: 2,
        name: '羽毛球馆',
        totalHours: 168,
        usedHours: 121,
        usageRate: 72,
        bookingCount: 203,
        popularTime: '19:00-22:00'
    },
    {
        id: 3,
        name: '足球场',
        totalHours: 168,
        usedHours: 114,
        usageRate: 68,
        bookingCount: 89,
        popularTime: '16:00-19:00'
    },
    {
        id: 4,
        name: '游泳馆',
        totalHours: 168,
        usedHours: 92,
        usageRate: 55,
        bookingCount: 178,
        popularTime: '17:00-20:00'
    },
    {
        id: 5,
        name: '网球场',
        totalHours: 168,
        usedHours: 81,
        usageRate: 48,
        bookingCount: 67,
        popularTime: '15:00-18:00'
    }
]

// 器材借用排行
export const equipmentBorrowRanking = [
    { id: 1, name: '篮球', category: '球类', borrowCount: 245, returnRate: 98 },
    { id: 2, name: '羽毛球拍', category: '球拍', borrowCount: 189, returnRate: 96 },
    { id: 3, name: '足球', category: '球类', borrowCount: 156, returnRate: 99 },
    { id: 4, name: '乒乓球拍', category: '球拍', borrowCount: 134, returnRate: 97 },
    { id: 5, name: '排球', category: '球类', borrowCount: 98, returnRate: 100 },
    { id: 6, name: '跳绳', category: '健身器材', borrowCount: 87, returnRate: 95 },
    { id: 7, name: '瑜伽垫', category: '健身器材', borrowCount: 76, returnRate: 94 },
    { id: 8, name: '护膝', category: '护具', borrowCount: 65, returnRate: 92 },
    { id: 9, name: '网球拍', category: '球拍', borrowCount: 54, returnRate: 96 },
    { id: 10, name: '哑铃', category: '健身器材', borrowCount: 43, returnRate: 98 }
]

// 用户活跃度数据（按小时统计）
export const userActivityByHour = {
    hours: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
    data: [12, 25, 45, 68, 89, 95, 78, 56, 72, 98, 112, 125, 145, 178, 198, 165, 89]
}

// 月度数据对比
export const monthlyComparison = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月'],
    venueBooking: [1250, 1380, 1520, 1680, 1850, 1920],
    equipmentBorrow: [890, 950, 1020, 1150, 1280, 1350],
    activityParticipation: [450, 520, 580, 650, 720, 780],
    newUsers: [120, 135, 158, 172, 189, 205]
}

// 场馆收入统计（如果有收费项目）
export const venueRevenue = [
    { name: '篮球馆', revenue: 15600, growth: 12.5 },
    { name: '羽毛球馆', revenue: 18900, growth: 15.8 },
    { name: '游泳馆', revenue: 22400, growth: 8.3 },
    { name: '足球场', revenue: 12800, growth: 10.2 },
    { name: '网球场', revenue: 9500, growth: 6.7 }
]

// 用户满意度数据
export const userSatisfaction = {
    categories: ['场地环境', '器材质量', '服务态度', '预约便利', '活动丰富度'],
    scores: [4.5, 4.2, 4.7, 4.6, 4.3] // 满分5分
}
