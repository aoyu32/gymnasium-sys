<template>
  <div class="student-home">
    <!-- 轮播图 -->
    <BannerCarousel />

    <!-- 快速入口 -->
    <QuickEntry />

    <!-- 热门活动 -->
    <section class="activities-section">
      <div class="section-header">
        <div class="section-title">热门活动</div>
        <el-button text type="primary" @click="navigate('/student/activities')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="activities-grid">
        <ActivityCard
          v-for="item in hotActivities"
          :key="item.id"
          :activity="item"
        />
      </div>
    </section>

    <!-- 可预约场地 -->
    <section class="venues-section">
      <div class="section-header">
        <div class="section-title">可预约场地</div>
        <el-button text type="primary" @click="navigate('/student/venue-apply')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="venues-grid">
        <VenueCard
          v-for="item in availableVenues"
          :key="item.id"
          :venue="item"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import BannerCarousel from './components/BannerCarousel.vue'
import QuickEntry from './components/QuickEntry.vue'
import ActivityCard from '@/components/activity-card/index.vue'
import VenueCard from '@/components/venue-card/index.vue'
import { activities } from '@/mock/activities'
import { venues } from '@/mock/venues'

const router = useRouter()

// 取前12个热门活动
const hotActivities = ref(activities.slice(0, 12))

// 取前6个可预约场地
const availableVenues = ref(venues.slice(0, 6))

const navigate = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
