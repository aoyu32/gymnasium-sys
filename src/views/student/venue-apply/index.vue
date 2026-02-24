<template>
  <div class="student-venue-apply">
    <el-tabs v-model="activeTab">
      <!-- 场地申请 -->
      <el-tab-pane label="场地申请" name="apply">
        <VenueFilter
          v-model:filters="filters"
          @reset="handleResetFilter"
        />
        <VenueList
          :venues="filteredVenues"
          @apply="handleApply"
          @reset="handleResetFilter"
        />
      </el-tab-pane>

      <!-- 申请记录 -->
      <el-tab-pane label="申请记录" name="records">
        <el-table :data="applications" stripe>
          <el-table-column prop="venueName" label="场地名称" />
          <el-table-column prop="date" label="使用日期" />
          <el-table-column prop="time" label="使用时段" />
          <el-table-column prop="activityType" label="活动类型" />
          <el-table-column prop="participants" label="参与人数" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">查看详情</el-button>
              <el-button
                v-if="row.status === 'pending'"
                link
                type="danger"
                size="small"
                @click="handleCancel(row)"
              >
                取消申请
              </el-button>
              <el-button
                link
                type="danger"
                size="small"
                @click="handleDelete(row)"
              >
                删除记录
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 申请对话框 -->
    <ApplyDialog
      v-model:visible="applyDialogVisible"
      :venue="currentVenue"
      @submit="handleSubmitApply"
    />

    <!-- 申请详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="申请详情"
      width="600px"
    >
      <el-descriptions :column="1" border v-if="currentApplication">
        <el-descriptions-item label="场地名称">{{ currentApplication.venueName }}</el-descriptions-item>
        <el-descriptions-item label="场地区域">{{ currentApplication.areaName || '无区域划分' }}</el-descriptions-item>
        <el-descriptions-item label="使用日期">{{ currentApplication.date }}</el-descriptions-item>
        <el-descriptions-item label="使用时段">{{ currentApplication.time }}</el-descriptions-item>
        <el-descriptions-item label="活动类型">{{ currentApplication.activityType }}</el-descriptions-item>
        <el-descriptions-item label="参与人数">{{ currentApplication.participants }}人</el-descriptions-item>
        <el-descriptions-item label="申请人姓名">{{ currentApplication.applicantName || '张三' }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentApplication.phone || '13800138000' }}</el-descriptions-item>
        <el-descriptions-item label="学号/工号">{{ currentApplication.studentId || '2021001' }}</el-descriptions-item>
        <el-descriptions-item label="申请理由">{{ currentApplication.reason || '组织班级篮球活动，增强同学们的体质和团队协作能力。' }}</el-descriptions-item>
        <el-descriptions-item label="申请状态">
          <el-tag :type="getStatusType(currentApplication.status)">{{ currentApplication.statusText }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentApplication.applyTime || '2026-02-20 10:30:00' }}</el-descriptions-item>
        <el-descriptions-item v-if="currentApplication.status === 'rejected'" label="拒绝原因">
          {{ currentApplication.rejectReason || '该时段场地已被预约' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="goToVenueDetail">查看场地详情</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import VenueFilter from './components/VenueFilter.vue'
import VenueList from './components/VenueList.vue'
import ApplyDialog from './components/ApplyDialog.vue'
import { venues } from '@/mock/venues'

const router = useRouter()
const activeTab = ref('apply')
const applyDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentVenue = ref({})
const currentApplication = ref(null)

const filters = ref({
  searchKeyword: '',
  category: '',
  status: ''
})

// 筛选后的场地列表
const filteredVenues = computed(() => {
  let result = [...venues]
  
  // 搜索筛选
  if (filters.value.searchKeyword) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(filters.value.searchKeyword.toLowerCase())
    )
  }
  
  // 分类筛选
  if (filters.value.category) {
    result = result.filter(item => item.category === filters.value.category)
  }
  
  // 状态筛选
  if (filters.value.status) {
    result = result.filter(item => item.status === filters.value.status)
  }
  
  return result
})

const applications = ref([
  {
    id: 1,
    venueId: 1,
    venueName: '篮球馆A场',
    areaName: 'A1场地',
    date: '2026-02-28',
    time: '14:00-16:00',
    activityType: '篮球',
    participants: 10,
    status: 'approved',
    statusText: '已通过',
    applicantName: '张三',
    phone: '13800138000',
    studentId: '2021001',
    reason: '组织班级篮球活动，增强同学们的体质和团队协作能力。',
    applyTime: '2026-02-20 10:30:00'
  },
  {
    id: 2,
    venueId: 2,
    venueName: '羽毛球馆',
    areaName: '1号场地',
    date: '2026-03-01',
    time: '09:00-11:00',
    activityType: '羽毛球',
    participants: 8,
    status: 'pending',
    statusText: '待审批',
    applicantName: '李四',
    phone: '13900139000',
    studentId: '2021002',
    reason: '羽毛球社团日常训练活动。',
    applyTime: '2026-02-22 15:20:00'
  },
  {
    id: 3,
    venueId: 3,
    venueName: '足球场',
    areaName: '全场',
    date: '2026-02-25',
    time: '16:00-18:00',
    activityType: '足球',
    participants: 22,
    status: 'rejected',
    statusText: '已拒绝',
    applicantName: '王五',
    phone: '13700137000',
    studentId: '2021003',
    reason: '院系足球友谊赛。',
    applyTime: '2026-02-18 09:15:00',
    rejectReason: '该时段场地已被预约，请选择其他时段。'
  }
])

const handleApply = (venue) => {
  if (venue.status === 'busy') {
    ElMessage.warning('该场地当前使用中，请选择其他场地')
    return
  }
  currentVenue.value = venue
  applyDialogVisible.value = true
}

const handleSubmitApply = (formData) => {
  console.log('提交申请:', formData)
  // 这里后期对接API
}

const handleResetFilter = () => {
  filters.value = {
    searchKeyword: '',
    category: '',
    status: ''
  }
}

const handleCancel = (row) => {
  ElMessageBox.confirm('确认取消该申请吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('已取消申请')
    // 这里后期对接API
  }).catch(() => {})
}

const handleViewDetail = (row) => {
  currentApplication.value = row
  detailDialogVisible.value = true
}

const goToVenueDetail = () => {
  if (currentApplication.value) {
    detailDialogVisible.value = false
    router.push(`/student/venue-apply/${currentApplication.value.venueId}`)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该申请记录吗？删除后将无法恢复。', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = applications.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      applications.value.splice(index, 1)
      ElMessage.success('已删除记录')
    }
    // 这里后期对接API
  }).catch(() => {})
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
