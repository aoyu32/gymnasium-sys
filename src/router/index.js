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
        path: 'venue-apply',
        name: 'StudentVenueApply',
        component: () => import('@/views/student/venue-apply/index.vue'),
        meta: { title: '场地申请' }
      },
      {
        path: 'equipment',
        name: 'StudentEquipment',
        component: () => import('@/views/student/equipment/index.vue'),
        meta: { title: '器材借还' }
      },
      {
        path: 'forum',
        name: 'StudentForum',
        component: () => import('@/views/student/forum/index.vue'),
        meta: { title: '体育论坛' }
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
    path: '/manager',
    name: 'ManagerLayout',
    component: () => import('@/views/layout/ManagerLayout.vue'),
    redirect: '/manager/home',
    children: [
      {
        path: 'home',
        name: 'ManagerHome',
        component: () => import('@/views/manager/home/index.vue'),
        meta: { title: '工作台' }
      }
    ]
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/views/layout/AdminLayout.vue'),
    redirect: '/admin/home',
    children: [
      {
        path: 'home',
        name: 'AdminHome',
        component: () => import('@/views/admin/home/index.vue'),
        meta: { title: '控制台' }
      }
    ]
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

export default router
