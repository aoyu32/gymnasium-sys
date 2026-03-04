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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BannerCarousel from './components/BannerCarousel.vue'
import QuickEntry from './components/QuickEntry.vue'
import ActivityCard from '@/components/activity-card/index.vue'
import VenueCard from '@/components/venue-card/index.vue'
import { getActivityPage } from '@/api/activity'
import { getVenuePage } from '@/api/venue'

const router = useRouter()

// 热门活动（取9个）
const hotActivities = ref([])

// 可预约场地（取9个）
const availableVenues = ref([])

// 加载热门活动
const loadHotActivities = async () => {
  try {
    const res = await getActivityPage({
      pageNum: 1,
      pageSize: 9
      // 不限制状态，查询所有活动
    })
    hotActivities.value = res.data.records || []
  } catch (error) {
    console.error('加载热门活动失败:', error)
    ElMessage.error('加载热门活动失败')
  }
}

// 加载可预约场地
const loadAvailableVenues = async () => {
  try {
    const res = await getVenuePage({
      pageNum: 1,
      pageSize: 9
      // 不限制状态，查询所有场地
    })
    availableVenues.value = res.data.records || []
  } catch (error) {
    console.error('加载可预约场地失败:', error)
    ElMessage.error('加载可预约场地失败')
  }
}

onMounted(() => {
  loadHotActivities()
  loadAvailableVenues()
})

const navigate = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
