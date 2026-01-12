<template>
  <div class="student-activities">
    <div class="page-header">
      <h1>活动中心</h1>
      <p>浏览并预约各类体育活动</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="活动类型">
          <el-select v-model="filterForm.type" placeholder="全部类型" clearable>
            <el-option label="篮球" value="basketball" />
            <el-option label="羽毛球" value="badminton" />
            <el-option label="乒乓球" value="tabletennis" />
            <el-option label="足球" value="football" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable>
            <el-option label="报名中" value="open" />
            <el-option label="已满员" value="full" />
            <el-option label="已结束" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 活动列表 -->
    <div class="activities-list">
      <div v-for="item in activities" :key="item.id" class="activity-item">
        <div class="activity-image">
          <img :src="item.image" :alt="item.title" />
        </div>
        <div class="activity-content">
          <div class="activity-header">
            <h3>{{ item.title }}</h3>
            <el-tag :type="getStatusType(item.status)">{{ item.statusText }}</el-tag>
          </div>
          <p class="activity-desc">{{ item.description }}</p>
          <div class="activity-meta">
            <div class="meta-item">
              <el-icon><Clock /></el-icon>
              <span>{{ item.time }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Location /></el-icon>
              <span>{{ item.venue }}</span>
            </div>
            <div class="meta-item">
              <el-icon><User /></el-icon>
              <span>{{ item.participants }}/{{ item.maxParticipants }}人</span>
            </div>
          </div>
        </div>
        <div class="activity-actions">
          <el-button type="primary" :disabled="item.status === 'full'" @click="handleBook(item)">
            {{ item.status === 'full' ? '已满员' : '立即预约' }}
          </el-button>
          <el-button @click="handleViewDetail(item)">查看详情</el-button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Clock, Location, User } from '@element-plus/icons-vue'

const filterForm = ref({
  type: '',
  status: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(30)

const activities = ref([
  {
    id: 1,
    title: '周末篮球友谊赛',
    description: '欢迎所有篮球爱好者参加，不限水平，重在参与和交流',
    time: '2026-01-18 14:00-16:00',
    venue: '篮球馆A场',
    participants: 8,
    maxParticipants: 10,
    status: 'open',
    statusText: '报名中',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300'
  },
  {
    id: 2,
    title: '羽毛球训练营',
    description: '专业教练指导，适合初学者和进阶者',
    time: '2026-01-20 09:00-11:00',
    venue: '羽毛球馆',
    participants: 20,
    maxParticipants: 20,
    status: 'full',
    statusText: '已满员',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300'
  }
])

const handleSearch = () => {
  ElMessage.success('搜索功能开发中')
}

const handleReset = () => {
  filterForm.value = { type: '', status: '' }
}

const handleBook = (item) => {
  ElMessage.success(`预约活动：${item.title}`)
}

const handleViewDetail = (item) => {
  ElMessage.info(`查看详情：${item.title}`)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const getStatusType = (status) => {
  const typeMap = {
    open: 'success',
    full: 'warning',
    closed: 'info'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
