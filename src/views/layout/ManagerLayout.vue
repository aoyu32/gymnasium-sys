<template>
  <div class="manager-layout">
    <el-container>
      <el-aside width="240px">
        <div class="logo">
          <el-icon :size="28"><Basketball /></el-icon>
          <span>场地管理</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#001529"
          text-color="rgba(255, 255, 255, 0.65)"
          active-text-color="#fff"
        >
          <el-menu-item index="/manager/home">
            <el-icon><HomeFilled /></el-icon>
            <span>工作台</span>
          </el-menu-item>
          <el-menu-item index="/manager/venues">
            <el-icon><Location /></el-icon>
            <span>场地管理</span>
          </el-menu-item>
          <el-menu-item index="/manager/bookings">
            <el-icon><Calendar /></el-icon>
            <span>活动审批</span>
          </el-menu-item>
          <el-menu-item index="/manager/equipment">
            <el-icon><Box /></el-icon>
            <span>器材管理</span>
          </el-menu-item>
          <el-menu-item index="/manager/statistics">
            <el-icon><DataAnalysis /></el-icon>
            <span>数据统计</span>
          </el-menu-item>
          <el-menu-item index="/manager/forum">
            <el-icon><ChatDotRound /></el-icon>
            <span>论坛管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-content">
            <div class="header-left">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/manager/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="header-right">
              <el-badge :value="3" class="notification-badge">
                <el-button circle>
                  <el-icon><Bell /></el-icon>
                </el-button>
              </el-badge>
              <el-dropdown @command="handleCommand">
                <div class="user-info">
                  <el-avatar :size="32"><el-icon><User /></el-icon></el-avatar>
                  <span>场地负责人</span>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">个人设置</el-dropdown-item>
                    <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  Basketball,
  HomeFilled,
  Location,
  Calendar,
  Box,
  DataAnalysis,
  ChatDotRound,
  Bell,
  User
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => route.meta.title || '')

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      router.push('/auth/login')
      ElMessage.success('已退出登录')
    }).catch(() => {})
  } else if (command === 'profile') {
    ElMessage.info('个人设置功能开发中')
  }
}
</script>

<style lang="scss" scoped>
@use './styles/ManagerLayout.scss';
</style>
