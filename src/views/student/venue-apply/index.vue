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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import VenueFilter from './components/VenueFilter.vue'
import VenueList from './components/VenueList.vue'
import ApplyDialog from './components/ApplyDialog.vue'
import { getVenuePage } from '@/api/venue'
import { getMyApplications, submitApplication, cancelApplication, deleteApplication } from '@/api/application'

const router = useRouter()
const activeTab = ref('apply')
const applyDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentVenue = ref({})
const currentApplication = ref(null)
const loading = ref(false)
const venues = ref([])
const applications = ref([])

const filters = ref({
  searchKeyword: '',
  category: '',
  status: ''
})

// 加载场地列表
const loadVenues = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: 1,
      pageSize: 100,
      name: filters.value.searchKeyword || undefined,
      category: filters.value.category || undefined,
      status: filters.value.status || undefined
    }
    const res = await getVenuePage(params)
    venues.value = res.data.records.map(venue => ({
      ...venue,
      image: venue.images ? JSON.parse(venue.images)[0] : '',
      images: venue.images ? JSON.parse(venue.images) : []
    }))
  } catch (error) {
    console.error('加载场地列表失败:', error)
    ElMessage.error('加载场地列表失败')
  } finally {
    loading.value = false
  }
}

// 加载申请记录
const loadApplications = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: 1,
      pageSize: 100
    }
    const res = await getMyApplications(params)
    applications.value = res.data.records.map(app => ({
      ...app,
      date: app.applyDate,
      time: app.timeSlot,
      statusText: getStatusText(app.status)
    }))
  } catch (error) {
    console.error('加载申请记录失败:', error)
    ElMessage.error('加载申请记录失败')
  } finally {
    loading.value = false
  }
}

// 初始化加载
onMounted(() => {
  loadVenues()
  loadApplications()
})

// 防抖函数
let debounceTimer = null
const debouncedLoadVenues = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    loadVenues()
  }, 500) // 500ms 防抖延迟
}

// 监听筛选条件变化
watch(filters, () => {
  debouncedLoadVenues()
}, { deep: true })

// 筛选后的场地列表
const filteredVenues = computed(() => {
  return venues.value
})

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return textMap[status] || status
}

const handleApply = (venue) => {
  if (venue.status === 'busy') {
    ElMessage.warning('该场地当前使用中，请选择其他场地')
    return
  }
  currentVenue.value = venue
  applyDialogVisible.value = true
}

const handleSubmitApply = async (formData) => {
  try {
    loading.value = true
    await submitApplication(formData)
    ElMessage.success('申请提交成功，请等待审核')
    applyDialogVisible.value = false
    // 重新加载申请记录
    await loadApplications()
    // 切换到申请记录标签页
    activeTab.value = 'records'
  } catch (error) {
    console.error('提交申请失败:', error)
    ElMessage.error(error.message || '提交申请失败')
  } finally {
    loading.value = false
  }
}

const handleResetFilter = () => {
  filters.value = {
    searchKeyword: '',
    category: '',
    status: ''
  }
  loadVenues()
}

const handleCancel = (row) => {
  ElMessageBox.confirm('确认取消该申请吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      loading.value = true
      await cancelApplication(row.id)
      ElMessage.success('已取消申请')
      // 重新加载申请记录
      await loadApplications()
    } catch (error) {
      console.error('取消申请失败:', error)
      ElMessage.error(error.message || '取消申请失败')
    } finally {
      loading.value = false
    }
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
  }).then(async () => {
    try {
      loading.value = true
      await deleteApplication(row.id)
      ElMessage.success('已删除记录')
      // 重新加载申请记录
      await loadApplications()
    } catch (error) {
      console.error('删除记录失败:', error)
      ElMessage.error(error.message || '删除记录失败')
    } finally {
      loading.value = false
    }
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
