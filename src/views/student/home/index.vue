<template>
  <div class="student-home">
    <!-- 轮播图 -->
    <section class="banner-section">
      <el-carousel height="400px" :interval="5000">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <el-button type="primary" size="large" round>{{ item.buttonText }}</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 快速入口 -->
    <section class="quick-entry-section">
      <div class="section-title">快速入口</div>
      <div class="quick-entry-grid">
        <div
          v-for="item in quickEntries"
          :key="item.id"
          class="entry-card"
          @click="navigate(item.path)"
        >
          <div class="entry-icon" :style="{ background: item.color }">
            <el-icon :size="32">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="entry-title">{{ item.title }}</div>
          <div class="entry-desc">{{ item.description }}</div>
        </div>
      </div>
    </section>

    <!-- 热门活动 -->
    <section class="activities-section">
      <div class="section-header">
        <div class="section-title">热门活动</div>
        <el-button text type="primary" @click="navigate('/student/activities')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="activities-grid">
        <div v-for="item in hotActivities" :key="item.id" class="activity-card">
          <div class="activity-image">
            <img :src="item.image" :alt="item.title" />
            <div class="activity-tag" :class="item.status">{{ item.statusText }}</div>
          </div>
          <div class="activity-info">
            <h3>{{ item.title }}</h3>
            <div class="activity-meta">
              <div class="meta-item">
                <el-icon><Clock /></el-icon>
                <span>{{ item.time }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Location /></el-icon>
                <span>{{ item.venue }}</span>
              </div>
            </div>
            <div class="activity-footer">
              <div class="participants">
                <el-icon><User /></el-icon>
                <span>{{ item.participants }}/{{ item.maxParticipants }}人</span>
              </div>
              <el-button type="primary" size="small">立即预约</el-button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar,
  Location,
  Box,
  ChatDotRound,
  ArrowRight,
  Clock,
  User
} from '@element-plus/icons-vue'

const router = useRouter()

const banners = ref([
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
])

const quickEntries = ref([
  {
    id: 1,
    title: '活动预约',
    description: '查看并预约体育活动',
    icon: 'Calendar',
    color: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    path: '/student/activities'
  },
  {
    id: 2,
    title: '场地申请',
    description: '申请使用体育场地',
    icon: 'Location',
    color: 'linear-gradient(135deg, #fa541c 0%, #ff7a45 100%)',
    path: '/student/venue-apply'
  },
  {
    id: 3,
    title: '器材借还',
    description: '在线借用体育器材',
    icon: 'Box',
    color: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)',
    path: '/student/equipment'
  },
  {
    id: 4,
    title: '体育论坛',
    description: '交流运动心得体会',
    icon: 'ChatDotRound',
    color: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)',
    path: '/student/forum'
  }
])

const hotActivities = ref([
  {
    id: 1,
    title: '周末篮球友谊赛',
    time: '2026-01-18 14:00',
    venue: '篮球馆A场',
    participants: 8,
    maxParticipants: 10,
    status: 'hot',
    statusText: '火热',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'
  },
  {
    id: 2,
    title: '羽毛球训练营',
    time: '2026-01-20 09:00',
    venue: '羽毛球馆',
    participants: 15,
    maxParticipants: 20,
    status: 'new',
    statusText: '最新',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400'
  },
  {
    id: 3,
    title: '乒乓球比赛',
    time: '2026-01-22 15:00',
    venue: '乒乓球室',
    participants: 12,
    maxParticipants: 16,
    status: 'hot',
    statusText: '火热',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400'
  }
])

const navigate = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
