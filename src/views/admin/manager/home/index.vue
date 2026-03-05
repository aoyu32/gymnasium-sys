<template>
  <div class="manager-home">
    <!-- 数据统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff1f0;">
              <el-icon :size="32" color="#f5222d"><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待审批预约</div>
              <div class="stat-value">{{ stats.pendingBookings }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff7e6;">
              <el-icon :size="32" color="#fa8c16"><Location /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">可用场地</div>
              <div class="stat-value">{{ stats.availableVenues }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fffbe6;">
              <el-icon :size="32" color="#faad14"><Box /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">借出器材</div>
              <div class="stat-value">{{ stats.borrowedEquipment }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff2e8;">
              <el-icon :size="32" color="#fa541c"><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">逾期未还</div>
              <div class="stat-value">{{ stats.overdueEquipment }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="content-row">
      <!-- 待处理事项 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>待处理事项</span>
              <div class="pagination-btns">
                <el-button 
                  link 
                  :disabled="taskPage === 1"
                  @click="taskPage--"
                >
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <el-button 
                  link 
                  :disabled="taskPage >= Math.ceil(allPendingTasks.length / pageSize)"
                  @click="taskPage++"
                >
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </template>
          <el-table :data="paginatedTasks" stripe>
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getTaskTypeTag(row.type)" size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" show-overflow-tooltip />
            <el-table-column prop="time" label="时间" width="160" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="handleTask(row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 今日场地使用 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>今日场地使用</span>
              <div class="pagination-btns">
                <el-button 
                  link 
                  :disabled="venuePage === 1"
                  @click="venuePage--"
                >
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <el-button 
                  link 
                  :disabled="venuePage >= Math.ceil(allTodayVenues.length / pageSize)"
                  @click="venuePage++"
                >
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </template>
          <el-table :data="paginatedVenues" stripe>
            <el-table-column prop="venueName" label="场地名称" />
            <el-table-column prop="time" label="使用时段" width="140" />
            <el-table-column prop="applicant" label="申请人" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTag(row.status)" size="small">{{ row.statusText }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="content-row">
      <!-- 器材借还提醒 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>器材借还提醒</span>
              <div class="pagination-btns">
                <el-button 
                  link 
                  :disabled="equipmentPage === 1"
                  @click="equipmentPage--"
                >
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <el-button 
                  link 
                  :disabled="equipmentPage >= Math.ceil(allEquipmentReminders.length / pageSize)"
                  @click="equipmentPage++"
                >
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </template>
          <el-table :data="paginatedEquipment" stripe>
            <el-table-column prop="equipmentName" label="器材名称" />
            <el-table-column prop="borrower" label="借用人" width="100" />
            <el-table-column prop="returnDate" label="应还日期" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.overdue ? 'danger' : 'warning'" size="small">
                  {{ row.overdue ? '已逾期' : '即将到期' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 本周热门活动 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>本周热门活动</span>
              <div class="pagination-btns">
                <el-button 
                  link 
                  :disabled="activityPage === 1"
                  @click="activityPage--"
                >
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <el-button 
                  link 
                  :disabled="activityPage >= Math.ceil(allHotActivities.length / pageSize)"
                  @click="activityPage++"
                >
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </template>
          <el-table :data="paginatedActivities" stripe>
            <el-table-column prop="name" label="活动名称" show-overflow-tooltip />
            <el-table-column prop="venue" label="场地" width="120" show-overflow-tooltip />
            <el-table-column prop="time" label="时间" width="140" />
            <el-table-column prop="participants" label="参与人数" width="100">
              <template #default="{ row }">
                <span style="color: #f5222d; font-weight: 500;">{{ row.participants }}人</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Location, Box, Warning, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getStats, getPendingTasks, getTodayVenues, getEquipmentReminders, getHotActivities } from '@/api/dashboard'

const router = useRouter()

const pageSize = 5

// 分页状态
const taskPage = ref(1)
const venuePage = ref(1)
const equipmentPage = ref(1)
const activityPage = ref(1)

const stats = ref({
  pendingBookings: 0,
  availableVenues: 0,
  borrowedEquipment: 0,
  overdueEquipment: 0
})

const allPendingTasks = ref([])
const allTodayVenues = ref([])
const allEquipmentReminders = ref([])
const allHotActivities = ref([])

// 分页计算
const paginatedTasks = computed(() => {
  const start = (taskPage.value - 1) * pageSize
  return allPendingTasks.value.slice(start, start + pageSize)
})

const paginatedVenues = computed(() => {
  const start = (venuePage.value - 1) * pageSize
  return allTodayVenues.value.slice(start, start + pageSize)
})

const paginatedEquipment = computed(() => {
  const start = (equipmentPage.value - 1) * pageSize
  return allEquipmentReminders.value.slice(start, start + pageSize)
})

const paginatedActivities = computed(() => {
  const start = (activityPage.value - 1) * pageSize
  return allHotActivities.value.slice(start, start + pageSize)
})

const getTaskTypeTag = (type) => {
  const typeMap = {
    '场地预约': 'primary',
    '器材归还': 'warning',
    '器材借用': 'success'
  }
  return typeMap[type] || 'info'
}

const getStatusTag = (status) => {
  const statusMap = {
    using: 'success',
    reserved: 'primary',
    available: 'info'
  }
  return statusMap[status] || 'info'
}

const handleTask = (task) => {
  if (task.type === '场地预约') {
    router.push('/admin/manager/activities')
  } else if (task.type === '器材归还' || task.type === '器材借用') {
    router.push('/admin/manager/equipment')
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getStats()
    if (res.code === 200) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载待处理事项
const loadPendingTasks = async () => {
  try {
    const res = await getPendingTasks()
    if (res.code === 200) {
      allPendingTasks.value = res.data
    }
  } catch (error) {
    console.error('加载待处理事项失败:', error)
  }
}

// 加载今日场地使用
const loadTodayVenues = async () => {
  try {
    const res = await getTodayVenues()
    if (res.code === 200) {
      allTodayVenues.value = res.data
    }
  } catch (error) {
    console.error('加载今日场地使用失败:', error)
  }
}

// 加载器材借还提醒
const loadEquipmentReminders = async () => {
  try {
    const res = await getEquipmentReminders()
    if (res.code === 200) {
      allEquipmentReminders.value = res.data
    }
  } catch (error) {
    console.error('加载器材借还提醒失败:', error)
  }
}

// 加载热门活动
const loadHotActivities = async () => {
  try {
    const res = await getHotActivities()
    if (res.code === 200) {
      allHotActivities.value = res.data
    }
  } catch (error) {
    console.error('加载热门活动失败:', error)
  }
}

// 初始化加载所有数据
const loadAllData = () => {
  loadStats()
  loadPendingTasks()
  loadTodayVenues()
  loadEquipmentReminders()
  loadHotActivities()
}

onMounted(() => {
  loadAllData()
})
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
