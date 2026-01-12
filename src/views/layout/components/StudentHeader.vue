<template>
  <header class="student-header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="header-logo" @click="goHome">
        <el-icon :size="32" color="#f5222d">
          <Basketball />
        </el-icon>
        <span class="logo-text">高校体育馆</span>
      </div>

      <!-- 导航菜单 -->
      <nav class="header-nav">
        <div
          v-for="item in navItems"
          :key="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          @click="navigate(item.path)"
        >
          <el-icon :size="18">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </div>
      </nav>

      <!-- 搜索框 -->
      <div class="header-search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索活动、场地..."
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- 用户操作区 -->
      <div class="header-actions">
        <!-- 消息通知 -->
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="action-item">
          <el-button circle @click="showNotifications">
            <el-icon :size="20">
              <Bell />
            </el-icon>
          </el-button>
        </el-badge>

        <!-- 用户信息 -->
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="36" :src="userInfo?.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <span class="username">{{ userInfo?.name || '学生用户' }}</span>
            <el-icon class="arrow"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                账号设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 消息通知抽屉 -->
    <el-drawer
      v-model="notificationDrawer"
      title="消息通知"
      direction="rtl"
      size="400px"
    >
      <div class="notification-list">
        <div
          v-for="item in notifications"
          :key="item.id"
          class="notification-item"
          :class="{ unread: !item.read }"
        >
          <div class="notification-icon">
            <el-icon :size="24" :color="getNotificationColor(item.type)">
              <component :is="getNotificationIcon(item.type)" />
            </el-icon>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ item.title }}</div>
            <div class="notification-desc">{{ item.content }}</div>
            <div class="notification-time">{{ item.time }}</div>
          </div>
        </div>
        <el-empty v-if="notifications.length === 0" description="暂无消息" />
      </div>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  Basketball,
  HomeFilled,
  Calendar,
  Location,
  Box,
  ChatDotRound,
  User,
  Search,
  Bell,
  ArrowDown,
  Setting,
  SwitchButton,
  SuccessFilled,
  WarningFilled,
  InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const searchKeyword = ref('')
const notificationDrawer = ref(false)
const unreadCount = ref(3)

const userInfo = computed(() => userStore.userInfo)

const navItems = [
  { path: '/student/home', label: '首页', icon: 'HomeFilled' },
  { path: '/student/activities', label: '活动中心', icon: 'Calendar' },
  { path: '/student/venue-apply', label: '场地申请', icon: 'Location' },
  { path: '/student/equipment', label: '器材借还', icon: 'Box' },
  { path: '/student/forum', label: '体育论坛', icon: 'ChatDotRound' }
]

const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: '预约成功',
    content: '您的篮球场预约申请已通过审批',
    time: '2分钟前',
    read: false
  },
  {
    id: 2,
    type: 'warning',
    title: '器材归还提醒',
    content: '您借用的羽毛球拍将于今天下午5点到期',
    time: '1小时前',
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: '活动通知',
    content: '本周六将举办校园篮球赛，欢迎报名参加',
    time: '3小时前',
    read: false
  }
])

const isActive = (path) => {
  return route.path === path
}

const navigate = (path) => {
  router.push(path)
}

const goHome = () => {
  router.push('/student/home')
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    ElMessage.info(`搜索: ${searchKeyword.value}`)
    // TODO: 实现搜索功能
  }
}

const showNotifications = () => {
  notificationDrawer.value = true
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/student/profile')
      break
    case 'settings':
      ElMessage.info('账号设置功能开发中')
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

const getNotificationIcon = (type) => {
  const iconMap = {
    success: 'SuccessFilled',
    warning: 'WarningFilled',
    info: 'InfoFilled'
  }
  return iconMap[type] || 'InfoFilled'
}

const getNotificationColor = (type) => {
  const colorMap = {
    success: '#52c41a',
    warning: '#faad14',
    info: '#1890ff'
  }
  return colorMap[type] || '#1890ff'
}
</script>

<style lang="scss" scoped>
@use '../styles/StudentHeader.scss';
</style>
