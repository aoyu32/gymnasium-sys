// 活动mock数据
export const activities = [
  // 报名中的活动
  {
    id: 1,
    title: '周末篮球友谊赛',
    time: '2026-02-01 14:00',
    venue: '篮球馆A场',
    participants: 8,
    maxParticipants: 10,
    status: 'hot',
    statusText: '火热',
    category: 'basketball',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'
  },
  {
    id: 2,
    title: '羽毛球训练营',
    time: '2026-02-03 09:00',
    venue: '羽毛球馆',
    participants: 15,
    maxParticipants: 20,
    status: 'new',
    statusText: '最新',
    category: 'badminton',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400'
  },
  // 已满员的活动
  {
    id: 3,
    title: '乒乓球比赛',
    time: '2026-02-05 15:00',
    venue: '乒乓球室',
    participants: 16,
    maxParticipants: 16,
    status: 'hot',
    statusText: '火热',
    category: 'tabletennis',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400'
  },
  {
    id: 4,
    title: '足球友谊赛',
    time: '2026-02-06 16:00',
    venue: '足球场',
    participants: 22,
    maxParticipants: 22,
    status: 'new',
    statusText: '最新',
    category: 'football',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400'
  },
  {
    id: 5,
    title: '网球双打赛',
    time: '2026-02-08 10:00',
    venue: '网球场',
    participants: 8,
    maxParticipants: 8,
    status: 'hot',
    statusText: '火热',
    category: 'tennis',
    activityType: 'private',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400'
  },
  // 已结束的活动
  {
    id: 6,
    title: '游泳训练课',
    time: '2026-01-20 14:00',
    venue: '游泳馆',
    participants: 10,
    maxParticipants: 15,
    status: 'new',
    statusText: '最新',
    category: 'swimming',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400'
  },
  {
    id: 7,
    title: '瑜伽健身课',
    time: '2026-01-15 18:00',
    venue: '健身房',
    participants: 12,
    maxParticipants: 12,
    status: 'new',
    statusText: '最新',
    category: 'fitness',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  },
  // 报名中的活动
  {
    id: 8,
    title: '排球联赛',
    time: '2026-02-14 15:00',
    venue: '排球馆',
    participants: 10,
    maxParticipants: 12,
    status: 'hot',
    statusText: '火热',
    category: 'volleyball',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400'
  },
  {
    id: 9,
    title: '跆拳道体验课',
    time: '2026-02-15 16:00',
    venue: '武术馆',
    participants: 5,
    maxParticipants: 10,
    status: 'new',
    statusText: '最新',
    category: 'martialarts',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400'
  },
  {
    id: 10,
    title: '晨跑活动',
    time: '2026-02-16 06:30',
    venue: '田径场',
    participants: 20,
    maxParticipants: 30,
    status: 'hot',
    statusText: '火热',
    category: 'running',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400'
  },
  // 已结束的活动
  {
    id: 11,
    title: '台球比赛',
    time: '2026-01-18 19:00',
    venue: '台球室',
    participants: 8,
    maxParticipants: 8,
    status: 'new',
    statusText: '最新',
    category: 'other',
    activityType: 'private',
    image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=400'
  },
  {
    id: 12,
    title: '攀岩体验',
    time: '2026-01-10 14:00',
    venue: '攀岩馆',
    participants: 6,
    maxParticipants: 10,
    status: 'new',
    statusText: '最新',
    category: 'other',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400'
  },
  // 报名中的活动
  {
    id: 13,
    title: '篮球技巧训练',
    time: '2026-02-22 10:00',
    venue: '篮球馆B场',
    participants: 12,
    maxParticipants: 15,
    status: 'hot',
    statusText: '火热',
    category: 'basketball',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'
  },
  {
    id: 14,
    title: '羽毛球单打赛',
    time: '2026-02-23 14:00',
    venue: '羽毛球馆',
    participants: 8,
    maxParticipants: 16,
    status: 'new',
    statusText: '最新',
    category: 'badminton',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400'
  },
  // 已满员的活动
  {
    id: 15,
    title: '足球训练营',
    time: '2026-02-24 16:00',
    venue: '足球场',
    participants: 25,
    maxParticipants: 25,
    status: 'hot',
    statusText: '火热',
    category: 'football',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400'
  },
  {
    id: 16,
    title: '乒乓球双打赛',
    time: '2026-02-25 15:00',
    venue: '乒乓球室',
    participants: 12,
    maxParticipants: 12,
    status: 'new',
    statusText: '最新',
    category: 'tabletennis',
    activityType: 'private',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400'
  },
  // 报名中的活动
  {
    id: 17,
    title: '网球初级课程',
    time: '2026-02-26 09:00',
    venue: '网球场',
    participants: 5,
    maxParticipants: 10,
    status: 'new',
    statusText: '最新',
    category: 'tennis',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400'
  },
  {
    id: 18,
    title: '游泳比赛',
    time: '2026-02-27 14:00',
    venue: '游泳馆',
    participants: 15,
    maxParticipants: 20,
    status: 'hot',
    statusText: '火热',
    category: 'swimming',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400'
  },
  // 已结束的活动
  {
    id: 19,
    title: '力量训练课',
    time: '2026-01-12 18:00',
    venue: '健身房',
    participants: 10,
    maxParticipants: 15,
    status: 'new',
    statusText: '最新',
    category: 'fitness',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  },
  // 已满员的活动
  {
    id: 20,
    title: '排球训练营',
    time: '2026-03-01 10:00',
    venue: '排球馆',
    participants: 18,
    maxParticipants: 18,
    status: 'hot',
    statusText: '火热',
    category: 'volleyball',
    activityType: 'public',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400'
  }
]

// 轮播图数据
export const banners = [
  {
    id: 1,
    title: '欢迎使用体育馆管理系统',
    description: '在线预约场地，轻松借用器材',
    buttonText: '立即体验',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200'
  },
  {
    id: 2,
    title: '校园篮球赛报名中',
    description: '展现你的运动风采',
    buttonText: '马上报名',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200'
  },
  {
    id: 3,
    title: '体育论坛上线',
    description: '分享运动心得，结识运动伙伴',
    buttonText: '去看看',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200'
  }
]

// 快速入口数据
export const quickEntries = [
  {
    id: 1,
    title: '活动预约',
    description: '查看并预约体育活动',
    icon: 'Calendar',
    color: '#ff6b6b',
    path: '/student/activities'
  },
  {
    id: 2,
    title: '场地申请',
    description: '申请使用体育场地',
    icon: 'Location',
    color: '#fa541c',
    path: '/student/venue-apply'
  },
  {
    id: 3,
    title: '器材借还',
    description: '在线借用体育器材',
    icon: 'Box',
    color: '#fa8c16',
    path: '/student/equipment'
  },
  {
    id: 4,
    title: '论坛发帖',
    description: '交流运动心得体会',
    icon: 'ChatDotRound',
    color: '#f5222d',
    path: '/student/forum'
  }
]
