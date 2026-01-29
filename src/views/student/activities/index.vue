<template>
  <div class="student-activities">
    <!-- 分类导航栏 -->
    <div class="category-nav">
      <div
        v-for="item in categories"
        :key="item.value"
        class="category-item"
        :class="{ active: activeCategory === item.value }"
        @click="handleCategoryChange(item.value)"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="活动状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="报名中" value="open" />
            <el-option label="已满员" value="full" />
            <el-option label="已结束" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动日期">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="人数范围">
          <div class="participants-range">
            <el-input-number
              v-model="filterForm.minParticipants"
              :min="0"
              :max="100"
              placeholder="最少人数"
              controls-position="right"
              style="width: 130px"
            />
            <span class="range-separator">-</span>
            <el-input-number
              v-model="filterForm.maxParticipants"
              :min="0"
              :max="100"
              placeholder="最多人数"
              controls-position="right"
              style="width: 130px"
            />
          </div>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="filterForm.activityType" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="公共活动" value="public" />
            <el-option label="私人活动" value="private" />
          </el-select>
        </el-form-item>
        <el-form-item class="reset-btn-item">
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 活动列表 -->
    <div v-if="activities.length > 0" class="activities-grid">
      <ActivityCard
        v-for="item in activities"
        :key="item.id"
        :activity="item"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-empty description="暂无符合条件的活动">
        <el-button type="primary" @click="handleReset">重置筛选条件</el-button>
      </el-empty>
    </div>

    <!-- 分页 -->
    <div v-if="activities.length > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Basketball,
  TrophyBase,
  Football,
  Sunny,
  More,
  RefreshLeft,
  Trophy,
  Timer,
  Bicycle
} from '@element-plus/icons-vue'
import ActivityCard from '@/components/activity-card/index.vue'
import { activities as mockActivities } from '@/mock/activities'

const activeCategory = ref('all')

const categories = ref([
  { label: '全部活动', value: 'all', icon: 'Sunny' },
  { label: '篮球', value: 'basketball', icon: 'Basketball' },
  { label: '足球', value: 'football', icon: 'Football' },
  { label: '羽毛球', value: 'badminton', icon: 'TrophyBase' },
  { label: '乒乓球', value: 'tabletennis', icon: 'Trophy' },
  { label: '网球', value: 'tennis', icon: 'TrophyBase' },
  { label: '排球', value: 'volleyball', icon: 'Basketball' },
  { label: '游泳', value: 'swimming', icon: 'Sunny' },
  { label: '健身', value: 'fitness', icon: 'Timer' },
  { label: '跑步', value: 'running', icon: 'Bicycle' },
  { label: '武术', value: 'martialarts', icon: 'Trophy' },
  { label: '其他', value: 'other', icon: 'More' }
])

const filterForm = ref({
  status: '',
  dateRange: [],
  minParticipants: null,
  maxParticipants: null,
  activityType: ''
})

const currentPage = ref(1)
const pageSize = ref(12)

// 筛选后的活动列表
const filteredActivities = computed(() => {
  let result = [...mockActivities]
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value)
  }
  
  // 按活动状态筛选
  if (filterForm.value.status) {
    result = result.filter(item => {
      const activityDate = new Date(item.time)
      const now = new Date()
      
      if (filterForm.value.status === 'open') {
        // 报名中：未满员且未结束
        return item.participants < item.maxParticipants && activityDate >= now
      } else if (filterForm.value.status === 'full') {
        // 已满员：参与人数达到上限
        return item.participants >= item.maxParticipants && activityDate >= now
      } else if (filterForm.value.status === 'closed') {
        // 已结束：活动时间已过
        return activityDate < now
      }
      return true
    })
  }
  
  // 按日期范围筛选
  if (filterForm.value.dateRange && filterForm.value.dateRange.length === 2) {
    const [startDate, endDate] = filterForm.value.dateRange
    result = result.filter(item => {
      const activityDate = new Date(item.time)
      return activityDate >= startDate && activityDate <= endDate
    })
  }
  
  // 按人数范围筛选
  if (filterForm.value.minParticipants !== null && filterForm.value.minParticipants > 0) {
    result = result.filter(item => item.maxParticipants >= filterForm.value.minParticipants)
  }
  if (filterForm.value.maxParticipants !== null && filterForm.value.maxParticipants > 0) {
    result = result.filter(item => item.maxParticipants <= filterForm.value.maxParticipants)
  }
  
  // 按活动类型筛选
  if (filterForm.value.activityType) {
    result = result.filter(item => item.activityType === filterForm.value.activityType)
  }
  
  return result
})

// 总数
const total = computed(() => filteredActivities.value.length)

// 当前页显示的活动
const activities = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredActivities.value.slice(start, end)
})

// 监听筛选条件变化，重置到第一页
watch([activeCategory, filterForm], () => {
  currentPage.value = 1
}, { deep: true })

const handleCategoryChange = (category) => {
  activeCategory.value = category
  const categoryLabel = categories.value.find(c => c.value === category)?.label
  ElMessage.success(`切换到：${categoryLabel}`)
}

const handleReset = () => {
  filterForm.value = {
    status: '',
    dateRange: [],
    minParticipants: null,
    maxParticipants: null,
    activityType: ''
  }
  activeCategory.value = 'all'
  ElMessage.info('已重置筛选条件')
}

const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
