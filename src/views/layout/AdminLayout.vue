<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="layout-aside">
        <div class="aside-header">
          <div class="header-content">
            <el-icon v-if="isCollapse" :size="24" color="#f5222d">
              <Basketball />
            </el-icon>
            <div v-else class="system-title">
              <el-icon :size="18" color="#f5222d">
                <Basketball />
              </el-icon>
              <span class="role-name">{{ roleName }}</span><span class="suffix">后台</span>
            </div>
          </div>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :unique-opened="true"
          router
        >
          <template v-for="item in menuItems" :key="item.path">
            <!-- 有子菜单的项 -->
            <el-sub-menu v-if="item.children" :index="item.path">
              <template #title>
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child.path"
                :index="child.path"
              >
                {{ child.title }}
              </el-menu-item>
            </el-sub-menu>
            <!-- 没有子菜单的项 -->
            <el-menu-item v-else :index="item.path">
              <el-icon><component :is="item.icon" /></el-icon>
              <template #title>{{ item.title }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 顶部栏 -->
        <el-header class="layout-header">
          <div class="header-left">
            <el-icon class="collapse-icon" @click="toggleCollapse">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: homeRoute }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :size="36">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="username">{{ userInfo?.name || userName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    个人信息
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main class="layout-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  Basketball,
  HomeFilled,
  Location,
  Calendar,
  Box,
  User,
  UserFilled,
  ChatDotRound,
  ArrowDown,
  SwitchButton,
  Fold,
  Expand
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)

const userInfo = computed(() => userStore.userInfo)
const activeMenu = computed(() => route.path)
const currentRoute = computed(() => route.meta?.title || '')

// 根据路由判断当前角色
const userRole = computed(() => {
  if (route.path.startsWith('/admin/manager')) {
    return 'manager'
  } else if (route.path.startsWith('/admin/system')) {
    return 'system'
  }
  return 'manager'
})

// 角色文本
const roleText = computed(() => {
  return userRole.value === 'manager' ? '场地负责人端' : '系统管理员端'
})

// 角色名称
const roleName = computed(() => {
  return userRole.value === 'manager' ? '场地负责人' : '系统管理员'
})

// 角色标签类型
const roleTagType = computed(() => {
  return userRole.value === 'manager' ? 'warning' : 'success'
})

// 根据角色显示不同的用户名
const userName = computed(() => {
  return userRole.value === 'manager' ? '场地负责人' : '系统管理员'
})

// 根据角色显示不同的首页路由
const homeRoute = computed(() => {
  return userRole.value === 'manager' ? '/admin/manager/home' : '/admin/system/home'
})

// 场地负责人菜单
const managerMenuItems = [
  { path: '/admin/manager/home', title: '工作台', icon: 'HomeFilled' },
  { 
    path: '/admin/manager/venues',
    title: '场地管理',
    icon: 'Location',
    children: [
      { path: '/admin/manager/venues/info', title: '场地信息管理' },
      { path: '/admin/manager/venues/applications', title: '场地申请管理' }
    ]
  },
  { 
    path: '/admin/manager/activities',
    title: '活动管理',
    icon: 'Calendar',
    children: [
      { path: '/admin/manager/activities/info', title: '活动信息管理' },
      { path: '/admin/manager/activities/applications', title: '活动申请管理' }
    ]
  },
  { path: '/admin/manager/equipment', title: '器材管理', icon: 'Box' }
]

// 系统管理员菜单
const systemMenuItems = [
  { path: '/admin/system/home', title: '工作台', icon: 'HomeFilled' },
  { path: '/admin/system/students', title: '学生管理', icon: 'User' },
  { path: '/admin/system/managers', title: '负责人管理', icon: 'UserFilled' },
  { path: '/admin/system/equipment', title: '器材管理', icon: 'Box' },
  { path: '/admin/system/forum', title: '论坛管理', icon: 'ChatDotRound' }
]

// 根据角色返回对应的菜单
const menuItems = computed(() => {
  return userRole.value === 'manager' ? managerMenuItems : systemMenuItems
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人信息功能开发中')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userStore.logout()
        router.push('/auth/login')
        ElMessage.success('已退出登录')
      }).catch(() => {})
      break
  }
}
</script>

<style lang="scss" scoped>
@use './styles/AdminLayout.scss';
</style>
