// 场地mock数据
export const venues = [
  {
    id: 1,
    name: '篮球馆A场',
    description: '标准篮球场，设施完善',
    capacity: 20,
    price: 50,
    status: 'available',
    category: 'basketball',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800',
      'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800'
    ],
    areas: [
      { id: 1, name: 'A1场地', inUse: false, maintenance: false, capacity: 10 },
      { id: 2, name: 'A2场地', inUse: true, maintenance: false, capacity: 10 }
    ]
  },
  {
    id: 2,
    name: '羽毛球馆',
    description: '8片标准羽毛球场地',
    capacity: 16,
    price: 30,
    status: 'partial_maintenance',
    category: 'badminton',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
      'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800'
    ],
    areas: [
      { id: 1, name: '1号场地', inUse: false, maintenance: false, capacity: 4 },
      { id: 2, name: '2号场地', inUse: false, maintenance: true, capacity: 4 },
      { id: 3, name: '3号场地', inUse: true, maintenance: false, capacity: 4 },
      { id: 4, name: '4号场地', inUse: false, maintenance: false, capacity: 4 }
    ]
  },
  {
    id: 3,
    name: '足球场',
    description: '标准11人制足球场',
    capacity: 30,
    price: 100,
    status: 'maintenance',
    category: 'football',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
      'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800'
    ],
    areas: [
      { id: 1, name: '全场', inUse: false, maintenance: true, capacity: 30 }
    ]
  },
  {
    id: 4,
    name: '网球场',
    description: '4片标准网球场地',
    capacity: 8,
    price: 40,
    status: 'available',
    category: 'tennis',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
    images: [
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800'
    ],
    areas: [
      { id: 1, name: '1号场地', inUse: false, maintenance: false, capacity: 2 },
      { id: 2, name: '2号场地', inUse: true, maintenance: false, capacity: 2 },
      { id: 3, name: '3号场地', inUse: false, maintenance: false, capacity: 2 },
      { id: 4, name: '4号场地', inUse: false, maintenance: false, capacity: 2 }
    ]
  },
  {
    id: 5,
    name: '游泳馆',
    description: '标准50米泳池',
    capacity: 50,
    price: 20,
    status: 'available',
    category: 'swimming',
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400',
    images: [
      'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800',
      'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800',
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800'
    ],
    areas: [
      { id: 1, name: '深水区', inUse: false, maintenance: false, capacity: 30 },
      { id: 2, name: '浅水区', inUse: false, maintenance: false, capacity: 20 }
    ]
  },
  {
    id: 6,
    name: '乒乓球室',
    description: '10张标准乒乓球台',
    capacity: 20,
    price: 15,
    status: 'available',
    category: 'tabletennis',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400',
    images: [
      'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800',
      'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800'
    ],
    areas: []
  },
  {
    id: 7,
    name: '篮球馆B场',
    description: '标准篮球场，灯光充足',
    capacity: 20,
    price: 50,
    status: 'available',
    category: 'basketball',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800'
    ],
    areas: [
      { id: 1, name: 'B1场地', inUse: false, maintenance: false, capacity: 10 },
      { id: 2, name: 'B2场地', inUse: false, maintenance: false, capacity: 10 }
    ]
  },
  {
    id: 8,
    name: '排球馆',
    description: '4片标准排球场地',
    capacity: 24,
    price: 40,
    status: 'available',
    category: 'volleyball',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400',
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
      'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800'
    ],
    areas: [
      { id: 1, name: '1号场地', inUse: true, maintenance: false, capacity: 12 },
      { id: 2, name: '2号场地', inUse: true, maintenance: false, capacity: 12 }
    ]
  },
  {
    id: 9,
    name: '健身房',
    description: '专业健身器材齐全',
    capacity: 30,
    price: 25,
    status: 'available',
    category: 'fitness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'
    ],
    areas: []
  },
  {
    id: 10,
    name: '田径场',
    description: '400米标准跑道',
    capacity: 100,
    price: 0,
    status: 'available',
    category: 'running',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400',
    images: [
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800'
    ],
    areas: []
  },
  {
    id: 11,
    name: '武术馆',
    description: '专业武术训练场地',
    capacity: 25,
    price: 35,
    status: 'available',
    category: 'martialarts',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400',
    images: [
      'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800'
    ],
    areas: []
  },
  {
    id: 12,
    name: '台球室',
    description: '8张专业台球桌',
    capacity: 16,
    price: 20,
    status: 'available',
    category: 'other',
    image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=400',
    images: [
      'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=800',
      'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800'
    ],
    areas: []
  }
]
