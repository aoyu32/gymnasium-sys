<template>
  <div class="venue-applications">
    <el-card>
      <template #header>
        <div class="header">
          <span>场地申请管理</span>
        </div>
      </template>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索申请人或关联活动"
          clearable
          style="width: 300px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="申请状态" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="待审批" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
        <el-select v-model="filterVenue" placeholder="场地筛选" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部场地" value="" />
          <el-option label="篮球馆A场" value="篮球馆A场" />
          <el-option label="羽毛球馆" value="羽毛球馆" />
          <el-option label="足球场" value="足球场" />
          <el-option label="网球场" value="网球场" />
        </el-select>
        <el-date-picker
          v-model="filterDate"
          type="date"
          placeholder="选择日期"
          clearable
          style="width: 200px; margin-left: 12px"
        />
      </div>

      <!-- 申请列表 -->
      <el-table :data="paginatedApplications" stripe style="margin-top: 20px" v-loading="loading">
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="contact" label="联系方式" width="120" />
        <el-table-column prop="venueName" label="场地名称" width="180">
          <template #default="{ row }">
            {{ row.venueName }}{{ row.areaName ? ` - ${row.areaName}` : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="activityName" label="关联活动" width="180" show-overflow-tooltip />
        <el-table-column prop="date" label="申请日期" width="120" />
        <el-table-column prop="timeSlot" label="时间段" width="140" />
        <el-table-column prop="participants" label="参与人数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div style="display: flex; gap: 8px; flex-wrap: nowrap; white-space: nowrap;">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
              <template v-if="row.status === 'pending'">
                <el-button link type="success" size="small" @click="handleApprove(row)">通过</el-button>
                <el-button link type="danger" size="small" @click="handleReject(row)">拒绝</el-button>
              </template>
              <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="申请详情"
      width="700px"
    >
      <div class="application-detail" v-if="currentApplication">
        <!-- 申请人信息 -->
        <div class="detail-section">
          <h3 class="section-title">申请人信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">申请人姓名：</span>
                <span class="value">{{ currentApplication.applicant }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">联系电话：</span>
                <span class="value">{{ currentApplication.contact }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">学号/工号：</span>
                <span class="value">{{ currentApplication.studentId || '未填写' }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 场地信息 -->
        <div class="detail-section">
          <h3 class="section-title">场地信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">场地名称：</span>
                <span class="value">{{ currentApplication.venueName }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">选择区域：</span>
                <span class="value">{{ currentApplication.areaName || '无区域划分' }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 申请信息 -->
        <div class="detail-section">
          <h3 class="section-title">申请信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">使用日期：</span>
                <span class="value">{{ currentApplication.date }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">使用时段：</span>
                <span class="value">{{ currentApplication.timeSlot }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">关联活动：</span>
                <span class="value">{{ currentApplication.activityName }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动类型：</span>
                <span class="value">{{ getActivityTypeLabel(currentApplication.activityType) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">参与人数：</span>
                <span class="value">{{ currentApplication.participants }}人</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">申请状态：</span>
                <el-tag :type="getStatusType(currentApplication.status)" size="small">
                  {{ getStatusText(currentApplication.status) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="detail-item">
                <span class="label">申请时间：</span>
                <span class="value">{{ currentApplication.applyTime }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 申请理由 -->
        <div class="detail-section" v-if="currentApplication.description">
          <h3 class="section-title">申请理由</h3>
          <p class="description-text">{{ currentApplication.description }}</p>
        </div>

        <!-- 拒绝原因 -->
        <div class="detail-section" v-if="currentApplication.rejectReason">
          <h3 class="section-title">拒绝原因</h3>
          <p class="description-text">{{ currentApplication.rejectReason }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <template v-if="currentApplication && currentApplication.status === 'pending'">
          <el-button type="success" @click="handleApprove(currentApplication)">通过申请</el-button>
          <el-button type="danger" @click="handleReject(currentApplication)">拒绝申请</el-button>
        </template>
      </template>
    </el-dialog>

    <!-- 拒绝原因对话框 -->
    <el-dialog
      v-model="rejectVisible"
      title="拒绝申请"
      width="500px"
    >
      <el-form :model="rejectForm" :rules="rejectRules" ref="rejectFormRef" label-width="80px">
        <el-form-item label="拒绝原因" prop="reason">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReject">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getAllApplications, approveApplication, deleteApplication } from '@/api/application'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterVenue = ref('')
const filterDate = ref('')
const detailVisible = ref(false)
const rejectVisible = ref(false)
const currentApplication = ref(null)
const rejectingApplication = ref(null)
const rejectFormRef = ref(null)
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const rejectForm = ref({
  reason: ''
})

const rejectRules = {
  reason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
}

const applications = ref([])

// 加载申请列表
const loadApplications = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      status: filterStatus.value || undefined,
      activityType: undefined
    }
    const res = await getAllApplications(params)
    applications.value = res.data.records.map(app => ({
      ...app,
      date: app.applyDate,
      timeSlot: app.timeSlot,
      applicant: app.applicantName || '未知',
      contact: app.applicantPhone || '未填写',
      studentId: app.applicantStudentId || '未填写',
      applyTime: formatDateTime(app.createdAt)
    }))
    total.value = res.data.total
  } catch (error) {
    console.error('加载申请列表失败:', error)
    ElMessage.error('加载申请列表失败')
  } finally {
    loading.value = false
  }
}

// 初始化加载
onMounted(() => {
  loadApplications()
})

// 监听筛选条件变化
watch([filterStatus], () => {
  currentPage.value = 1
  loadApplications()
})

// 前端筛选（搜索关键词、场地、日期）
const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const matchKeyword = !searchKeyword.value || 
      app.applicant.includes(searchKeyword.value) || 
      app.activityName.includes(searchKeyword.value)
    const matchVenue = !filterVenue.value || app.venueName === filterVenue.value
    const matchDate = !filterDate.value || app.date === formatDate(filterDate.value)
    return matchKeyword && matchVenue && matchDate
  })
})

// 分页后的数据
const paginatedApplications = computed(() => {
  return filteredApplications.value
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateTime = (datetime) => {
  if (!datetime) return ''
  const d = new Date(datetime)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return textMap[status] || status
}

const getActivityTypeLabel = (type) => {
  const typeMap = {
    basketball: '篮球',
    football: '足球',
    badminton: '羽毛球',
    tabletennis: '乒乓球',
    tennis: '网球',
    volleyball: '排球',
    swimming: '游泳',
    fitness: '健身',
    running: '跑步',
    martialarts: '武术',
    other: '其他'
  }
  return typeMap[type] || type
}

const handleApprove = (row) => {
  ElMessageBox.confirm(
    `确定通过"${row.activityName}"的场地申请吗？`,
    '确认通过',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(async () => {
    try {
      loading.value = true
      await approveApplication(row.id, true, null)
      ElMessage.success('申请已通过')
      detailVisible.value = false
      // 重新加载列表
      await loadApplications()
    } catch (error) {
      console.error('审批失败:', error)
      // 错误提示已由全局拦截器显示，这里不再重复显示
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

const handleReject = (row) => {
  rejectingApplication.value = row
  rejectForm.value.reason = ''
  rejectVisible.value = true
}

const confirmReject = async () => {
  if (!rejectFormRef.value) return
  
  await rejectFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        await approveApplication(rejectingApplication.value.id, false, rejectForm.value.reason)
        ElMessage.success('申请已拒绝')
        rejectVisible.value = false
        detailVisible.value = false
        // 重新加载列表
        await loadApplications()
      } catch (error) {
        console.error('审批失败:', error)
        // 错误提示已由全局拦截器显示，这里不再重复显示
      } finally {
        loading.value = false
      }
    }
  })
}

const handleViewDetail = (row) => {
  currentApplication.value = row
  detailVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该申请记录吗？删除后将无法恢复。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      await deleteApplication(row.id)
      ElMessage.success('记录删除成功')
      // 如果当前详情弹窗显示的是被删除的记录，关闭弹窗
      if (currentApplication.value?.id === row.id) {
        detailVisible.value = false
      }
      // 重新加载列表
      await loadApplications()
    } catch (error) {
      console.error('删除失败:', error)
      // 错误提示已由全局拦截器显示，这里不再重复显示
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  loadApplications()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadApplications()
}
</script>

<style lang="scss" scoped>
@use './styles/applications.scss';
</style>
