<template>
  <header class="student-header">
    <div class="header-container">
      <div class="header-logo" @click="goHome">
        <el-icon :size="32" color="#f5222d">
          <Basketball />
        </el-icon>
        <span class="logo-text">高校体育馆</span>
      </div>

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

      <div v-if="!isSearchPage" class="header-search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索活动、场地、器材"
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
        />
      </div>

      <div class="header-actions">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="action-item">
          <el-button circle @click="showNotifications">
            <el-icon :size="20">
              <Bell />
            </el-icon>
          </el-button>
        </el-badge>

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
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-drawer v-model="notificationDrawer" title="消息通知" direction="rtl" size="400px">
      <div class="notification-toolbar">
        <el-button link :loading="notificationLoading" @click="loadNotifications">刷新</el-button>
        <el-button link :disabled="unreadCount === 0" @click="handleMarkAllRead">全部已读</el-button>
      </div>

      <div class="notification-list" v-loading="notificationLoading">
        <div
          v-for="item in notifications"
          :key="item.id"
          class="notification-item"
          :class="{ unread: !item.read }"
          @click="handleNotificationClick(item)"
        >
          <div class="notification-icon">
            <el-icon :size="24" :color="getNotificationColor(item.businessType)">
              <component :is="getNotificationIcon(item.businessType)" />
            </el-icon>
          </div>
          <div class="notification-content">
            <div class="notification-title-row">
              <div class="notification-title">{{ item.title }}</div>
              <div class="notification-actions">
                <span v-if="!item.read" class="unread-dot"></span>
                <el-button
                  class="delete-btn"
                  link
                  type="danger"
                  @click.stop="handleDeleteNotification(item)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="notification-desc">{{ item.content }}</div>
            <div class="notification-meta">
              <span>{{ item.senderName || '系统' }}</span>
              <span>{{ item.time }}</span>
            </div>
          </div>
        </div>
        <el-empty v-if="!notificationLoading && notifications.length === 0" description="暂无消息" />
      </div>
    </el-drawer>
  </header>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
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
  SwitchButton,
  InfoFilled,
  Delete
} from '@element-plus/icons-vue'
import {
  getNotificationPage,
  getUnreadNotificationCount,
  markNotificationRead,
  deleteNotification,
  markAllNotificationsRead
} from '@/api/notification'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const searchKeyword = ref('')
const notificationDrawer = ref(false)
const notificationLoading = ref(false)
const unreadCount = ref(0)
const notifications = ref([])

const userInfo = computed(() => userStore.userInfo)
const isSearchPage = computed(() => route.path === '/student/search')

const navItems = [
  { path: '/student/home', label: '首页', icon: HomeFilled },
  { path: '/student/activities', label: '活动中心', icon: Calendar },
  { path: '/student/venue-apply', label: '场地申请', icon: Location },
  { path: '/student/equipment', label: '器材借还', icon: Box },
  { path: '/student/forum', label: '体育论坛', icon: ChatDotRound }
]

const isActive = (path) => route.path === path

const navigate = (path) => {
  router.push(path)
}

const goHome = () => {
  router.push('/student/home')
}

const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    return
  }
  const routeUrl = router.resolve({
    path: '/student/search',
    query: { keyword: searchKeyword.value }
  })
  window.open(routeUrl.href, '_blank')
  searchKeyword.value = ''
}

const loadUnreadCount = async () => {
  try {
    const res = await getUnreadNotificationCount()
    unreadCount.value = Number(res.data || 0)
  } catch (error) {
    unreadCount.value = 0
  }
}

const normalizeNotification = (item) => ({
  id: item.id,
  title: item.title,
  content: item.content,
  senderName: item.senderName,
  businessType: item.businessType,
  time: item.createdAt,
  read: item.isRead === 1
})

const loadNotifications = async () => {
  notificationLoading.value = true
  try {
    const res = await getNotificationPage({
      pageNum: 1,
      pageSize: 20
    })
    notifications.value = (res.data?.records || []).map(normalizeNotification)
  } finally {
    notificationLoading.value = false
  }
}

const showNotifications = () => {
  notificationDrawer.value = true
}

const handleNotificationClick = async (item) => {
  if (item.read) {
    return
  }
  await markNotificationRead(item.id)
  item.read = true
  unreadCount.value = Math.max(0, unreadCount.value - 1)
}

const handleDeleteNotification = async (item) => {
  try {
    await ElMessageBox.confirm('确定删除这条消息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteNotification(item.id)
    notifications.value = notifications.value.filter(notification => notification.id !== item.id)
    if (!item.read) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
    ElMessage.success('消息删除成功')
  } catch (error) {
    // 用户取消时不提示
  }
}

const handleMarkAllRead = async () => {
  await markAllNotificationsRead()
  notifications.value = notifications.value.map(item => ({
    ...item,
    read: true
  }))
  unreadCount.value = 0
  ElMessage.success('消息已全部标记为已读')
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/student/profile')
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
    default:
      break
  }
}

const getNotificationIcon = (businessType) => {
  const iconMap = {
    venue_application: Location,
    activity_registration: Calendar,
    equipment_borrow: Box,
    equipment_return: Box
  }
  return iconMap[businessType] || InfoFilled
}

const getNotificationColor = (businessType) => {
  const colorMap = {
    venue_application: '#52c41a',
    activity_registration: '#1890ff',
    equipment_borrow: '#fa8c16',
    equipment_return: '#13c2c2'
  }
  return colorMap[businessType] || '#1890ff'
}

watch(notificationDrawer, async (visible) => {
  if (visible) {
    await loadNotifications()
    await loadUnreadCount()
  }
})

onMounted(() => {
  loadUnreadCount()
})
</script>

<style lang="scss" scoped>
@use '../styles/StudentHeader.scss';
</style>
