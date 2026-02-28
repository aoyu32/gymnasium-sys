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
            <el-table-column prop="venue" label="场地" width="120" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Location, Box, Warning, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

const pageSize = 5

// 分页状态
const taskPage = ref(1)
const venuePage = ref(1)
const equipmentPage = ref(1)
const activityPage = ref(1)

const stats = ref({
  pendingBookings: 8,
  availableVenues: 12,
  borrowedEquipment: 45,
  overdueEquipment: 3
})

const allPendingTasks = ref([
  { id: 1, type: '场地预约', content: '张三申请预约篮球馆A场（2026-02-25 14:00-16:00）', time: '2026-02-24 10:30' },
  { id: 2, type: '器材归还', content: '李四申请归还篮球2个', time: '2026-02-24 11:00' },
  { id: 3, type: '场地预约', content: '王五申请预约羽毛球馆（2026-02-26 09:00-11:00）', time: '2026-02-24 11:30' },
  { id: 4, type: '器材借用', content: '赵六申请借用足球3个', time: '2026-02-24 12:00' },
  { id: 5, type: '场地预约', content: '孙七申请预约网球场（2026-02-27 10:00-12:00）', time: '2026-02-24 13:00' },
  { id: 6, type: '器材归还', content: '周八申请归还羽毛球拍4副', time: '2026-02-24 14:00' },
  { id: 7, type: '场地预约', content: '吴九申请预约乒乓球馆（2026-02-28 15:00-17:00）', time: '2026-02-24 15:00' },
  { id: 8, type: '器材借用', content: '郑十申请借用排球2个', time: '2026-02-24 16:00' },
  { id: 9, type: '场地预约', content: '钱十一申请预约游泳馆（2026-03-01 08:00-10:00）', time: '2026-02-24 17:00' },
  { id: 10, type: '器材归还', content: '陈十二申请归还乒乓球拍2副', time: '2026-02-24 18:00' }
])

const allTodayVenues = ref([
  { id: 1, venueName: '篮球馆A场', time: '14:00-16:00', applicant: '张三', status: 'using', statusText: '使用中' },
  { id: 2, venueName: '羽毛球馆1号', time: '16:00-18:00', applicant: '李四', status: 'reserved', statusText: '已预约' },
  { id: 3, venueName: '足球场', time: '18:00-20:00', applicant: '王五', status: 'reserved', statusText: '已预约' },
  { id: 4, venueName: '网球场1号', time: '10:00-12:00', applicant: '赵六', status: 'using', statusText: '使用中' },
  { id: 5, venueName: '乒乓球馆', time: '15:00-17:00', applicant: '孙七', status: 'reserved', statusText: '已预约' },
  { id: 6, venueName: '篮球馆B场', time: '08:00-10:00', applicant: '周八', status: 'using', statusText: '使用中' },
  { id: 7, venueName: '羽毛球馆2号', time: '09:00-11:00', applicant: '吴九', status: 'reserved', statusText: '已预约' },
  { id: 8, venueName: '游泳馆', time: '07:00-09:00', applicant: '郑十', status: 'using', statusText: '使用中' },
  { id: 9, venueName: '网球场2号', time: '13:00-15:00', applicant: '钱十一', status: 'reserved', statusText: '已预约' },
  { id: 10, venueName: '排球场', time: '19:00-21:00', applicant: '陈十二', status: 'reserved', statusText: '已预约' }
])

const allEquipmentReminders = ref([
  { id: 1, equipmentName: '篮球', borrower: '张三', returnDate: '2026-02-24', overdue: false },
  { id: 2, equipmentName: '羽毛球拍', borrower: '李四', returnDate: '2026-02-23', overdue: true },
  { id: 3, equipmentName: '足球', borrower: '王五', returnDate: '2026-02-25', overdue: false },
  { id: 4, equipmentName: '网球拍', borrower: '赵六', returnDate: '2026-02-24', overdue: false },
  { id: 5, equipmentName: '乒乓球拍', borrower: '孙七', returnDate: '2026-02-22', overdue: true },
  { id: 6, equipmentName: '排球', borrower: '周八', returnDate: '2026-02-26', overdue: false },
  { id: 7, equipmentName: '羽毛球', borrower: '吴九', returnDate: '2026-02-24', overdue: false },
  { id: 8, equipmentName: '跳绳', borrower: '郑十', returnDate: '2026-02-21', overdue: true },
  { id: 9, equipmentName: '毽子', borrower: '钱十一', returnDate: '2026-02-25', overdue: false },
  { id: 10, equipmentName: '呼啦圈', borrower: '陈十二', returnDate: '2026-02-24', overdue: false }
])

const allHotActivities = ref([
  { id: 1, name: '篮球友谊赛', venue: '篮球馆A场', time: '2026-02-25 14:00', participants: 28 },
  { id: 2, name: '羽毛球训练营', venue: '羽毛球馆', time: '2026-02-26 09:00', participants: 24 },
  { id: 3, name: '足球联赛', venue: '足球场', time: '2026-02-27 16:00', participants: 35 },
  { id: 4, name: '乒乓球比赛', venue: '乒乓球馆', time: '2026-02-28 10:00', participants: 20 },
  { id: 5, name: '网球双打赛', venue: '网球场', time: '2026-03-01 15:00', participants: 16 },
  { id: 6, name: '游泳接力赛', venue: '游泳馆', time: '2026-03-02 08:00', participants: 32 },
  { id: 7, name: '排球对抗赛', venue: '排球场', time: '2026-03-03 14:00', participants: 18 },
  { id: 8, name: '羽毛球单打赛', venue: '羽毛球馆', time: '2026-03-04 10:00', participants: 22 },
  { id: 9, name: '篮球技巧赛', venue: '篮球馆B场', time: '2026-03-05 16:00', participants: 26 },
  { id: 10, name: '网球混双赛', venue: '网球场', time: '2026-03-06 13:00', participants: 14 }
])

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
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
