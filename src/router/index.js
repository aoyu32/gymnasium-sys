import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/auth/index.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue')
      },
      {
        path: 'forget-password',
        name: 'ForgetPassword',
        component: () => import('@/views/auth/ForgetPassword.vue')
      }
    ]
  },
  {
    path: '/student',
    name: 'StudentLayout',
    component: () => import('@/views/layout/StudentLayout.vue'),
    redirect: '/student/home',
    children: [
      {
        path: 'home',
        name: 'StudentHome',
        component: () => import('@/views/student/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'activities',
        name: 'StudentActivities',
        component: () => import('@/views/student/activities/index.vue'),
        meta: { title: '活动中心' }
      },
      {
        path: 'activities/:id',
        name: 'ActivityDetail',
        component: () => import('@/views/student/activities/detail.vue'),
        meta: { title: '活动详情' }
      },
      {
        path: 'venue-apply',
        name: 'StudentVenueApply',
        component: () => import('@/views/student/venue-apply/index.vue'),
        meta: { title: '场地申请' }
      },
      {
        path: 'venue-apply/:id',
        name: 'VenueDetail',
        component: () => import('@/views/student/venue-apply/detail.vue'),
        meta: { title: '场地详情' }
      },
      {
        path: 'equipment',
        name: 'StudentEquipment',
        component: () => import('@/views/student/equipment/index.vue'),
        meta: { title: '器材借还' }
      },
      {
        path: 'equipment/:id',
        name: 'EquipmentDetail',
        component: () => import('@/views/student/equipment/detail.vue'),
        meta: { title: '器材详情' }
      },
      {
        path: 'forum',
        name: 'StudentForum',
        component: () => import('@/views/student/forum/index.vue'),
        meta: { title: '体育论坛' }
      },
      {
        path: 'forum/create',
        name: 'ForumCreatePost',
        component: () => import('@/views/student/forum/create.vue'),
        meta: { title: '发布帖子' }
      },
      {
        path: 'forum/:id',
        name: 'ForumPostDetail',
        component: () => import('@/views/student/forum/detail.vue'),
        meta: { title: '帖子详情' }
      },
      {
        path: 'search',
        name: 'StudentSearch',
        component: () => import('@/views/student/search/index.vue'),
        meta: { title: '搜索' }
      },
      {
        path: 'profile',
        name: 'StudentProfile',
        component: () => import('@/views/student/profile/index.vue'),
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/views/layout/AdminLayout.vue'),
    redirect: '/admin/manager/home',
    children: [
      // 通用home路由，重定向到manager/home（默认）
      {
        path: 'home',
        redirect: '/admin/manager/home'
      },
      // 场地负责人模块
      {
        path: 'manager/home',
        name: 'ManagerHome',
        component: () => import('@/views/admin/manager/home/index.vue'),
        meta: { title: '工作台' }
      },
      {
        path: 'manager/venues',
        name: 'ManagerVenues',
        redirect: '/admin/manager/venues/info',
        meta: { title: '场地管理' },
        children: [
          {
            path: 'info',
            name: 'ManagerVenuesInfo',
            component: () => import('@/views/admin/manager/venues/info.vue'),
            meta: { title: '场地信息管理' }
          },
          {
            path: 'applications',
            name: 'ManagerVenuesApplications',
            component: () => import('@/views/admin/manager/venues/applications.vue'),
            meta: { title: '场地申请管理' }
          }
        ]
      },
      {
        path: 'manager/activities',
        name: 'ManagerActivities',
        redirect: '/admin/manager/activities/info',
        meta: { title: '活动管理' },
        children: [
          {
            path: 'info',
            name: 'ManagerActivitiesInfo',
            component: () => import('@/views/admin/manager/activities/info.vue'),
            meta: { title: '活动信息管理' }
          },
          {
            path: 'applications',
            name: 'ManagerActivitiesApplications',
            component: () => import('@/views/admin/manager/activities/applications.vue'),
            meta: { title: '活动申请管理' }
          },
          {
            path: 'my-activities',
            name: 'ManagerMyActivities',
            component: () => import('@/views/admin/manager/activities/my-activities.vue'),
            meta: { title: '我的活动管理' }
          }
        ]
      },
      {
        path: 'manager/equipment',
        name: 'ManagerEquipment',
        redirect: '/admin/manager/equipment/info',
        meta: { title: '器材管理' },
        children: [
          {
            path: 'info',
            name: 'ManagerEquipmentInfo',
            component: () => import('@/views/admin/manager/equipment/info.vue'),
            meta: { title: '器材信息管理' }
          },
          {
            path: 'borrow',
            name: 'ManagerEquipmentBorrow',
            component: () => import('@/views/admin/manager/equipment/borrow.vue'),
            meta: { title: '器材借用管理' }
          },
          {
            path: 'return',
            name: 'ManagerEquipmentReturn',
            component: () => import('@/views/admin/manager/equipment/return.vue'),
            meta: { title: '器材归还管理' }
          }
        ]
      },
      // 系统管理员模块
      {
        path: 'system/home',
        name: 'SystemHome',
        component: () => import('@/views/admin/system/home/index.vue'),
        meta: { title: '数据看板' }
      },
      {
        path: 'system/students',
        name: 'SystemStudents',
        component: () => import('@/views/admin/system/students/index.vue'),
        meta: { title: '学生管理' }
      },
      {
        path: 'system/managers',
        name: 'SystemManagers',
        component: () => import('@/views/admin/system/managers/index.vue'),
        meta: { title: '负责人管理' }
      },
      {
        path: 'system/equipment',
        name: 'SystemEquipment',
        redirect: '/admin/system/equipment/categories',
        meta: { title: '器材管理' },
        children: [
          {
            path: 'categories',
            name: 'SystemEquipmentCategories',
            component: () => import('@/views/admin/system/equipment/categories.vue'),
            meta: { title: '器材分类管理' }
          },
          {
            path: 'applications',
            name: 'SystemEquipmentApplications',
            component: () => import('@/views/admin/system/equipment/applications.vue'),
            meta: { title: '器材申请管理' }
          }
        ]
      },
      {
        path: 'system/forum',
        name: 'SystemForum',
        redirect: '/admin/system/forum/categories',
        meta: { title: '论坛管理' },
        children: [
          {
            path: 'categories',
            name: 'SystemForumCategories',
            component: () => import('@/views/admin/system/forum/categories.vue'),
            meta: { title: '帖子分类管理' }
          },
          {
            path: 'posts',
            name: 'SystemForumPosts',
            component: () => import('@/views/admin/system/forum/posts.vue'),
            meta: { title: '帖子信息管理' }
          }
        ]
      }
    ]
  },
  // 重定向旧的manager路径到新的admin/manager路径
  {
    path: '/manager/:pathMatch(.*)*',
    redirect: to => {
      return `/admin/manager/${to.params.pathMatch}`
    }
  },
  // 重定向旧的system路径到新的admin/system路径
  {
    path: '/system/:pathMatch(.*)*',
    redirect: to => {
      return `/admin/system/${to.params.pathMatch}`
    }
  },
  {
    path: '/',
    redirect: '/auth/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫 - 验证登录状态和角色权限
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // 调试信息
  console.log('=== 路由守卫 ===')
  console.log('从:', from.path)
  console.log('到:', to.path)
  console.log('Token:', token ? '存在' : '不存在')
  console.log('Role:', role)
  console.log('===============')

  // 如果访问的是认证页面（登录、注册、忘记密码），直接放行
  if (to.path.startsWith('/auth')) {
    // 如果已登录，根据角色重定向到对应首页，防止已登录用户访问登录页
    if (token && role) {
      console.log('已登录用户访问认证页面，重定向到首页')
      if (role === 'student') {
        next('/student/home')
      } else if (role === 'manager') {
        next('/admin/manager/home')
      } else if (role === 'admin') {
        next('/admin/system/home')
      } else {
        next()
      }
    } else {
      next()
    }
    return
  }

  // 如果访问的是需要登录的页面，验证token
  if (!token || !role) {
    // 未登录，重定向到登录页
    console.log('未登录，重定向到登录页')
    next('/auth/login')
    return
  }

  // 验证角色权限 - 学生只能访问学生页面
  if (to.path.startsWith('/student')) {
    if (role !== 'student') {
      // 非学生访问学生页面，重定向到对应首页
      console.log('非学生访问学生页面，重定向')
      if (role === 'manager') {
        next('/admin/manager/home')
      } else if (role === 'admin') {
        next('/admin/system/home')
      } else {
        next('/auth/login')
      }
      return
    }
  }

  // 验证角色权限 - 场地负责人只能访问manager页面
  if (to.path.startsWith('/admin/manager')) {
    if (role !== 'manager') {
      // 非场地负责人访问场地负责人页面，重定向到对应首页
      console.log('非场地负责人访问场地负责人页面，重定向')
      if (role === 'student') {
        next('/student/home')
      } else if (role === 'admin') {
        next('/admin/system/home')
      } else {
        next('/auth/login')
      }
      return
    }
  }

  // 验证角色权限 - 系统管理员只能访问system页面
  if (to.path.startsWith('/admin/system')) {
    if (role !== 'admin') {
      // 非系统管理员访问系统管理员页面，重定向到对应首页
      console.log('非系统管理员访问系统管理员页面，重定向')
      if (role === 'student') {
        next('/student/home')
      } else if (role === 'manager') {
        next('/admin/manager/home')
      } else {
        next('/auth/login')
      }
      return
    }
  }

  // 处理/admin路径的重定向
  if (to.path === '/admin' || to.path === '/admin/') {
    console.log('访问/admin，根据角色重定向')
    if (role === 'manager') {
      next('/admin/manager/home')
    } else if (role === 'admin') {
      next('/admin/system/home')
    } else {
      next('/auth/login')
    }
    return
  }

  // 处理根路径的重定向
  if (to.path === '/') {
    console.log('访问根路径，根据角色重定向')
    if (role === 'student') {
      next('/student/home')
    } else if (role === 'manager') {
      next('/admin/manager/home')
    } else if (role === 'admin') {
      next('/admin/system/home')
    } else {
      next('/auth/login')
    }
    return
  }

  // 验证通过，放行
  console.log('验证通过，放行')
  next()
})

export default router
