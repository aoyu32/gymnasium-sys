<template>
  <div class="activity-applications">
    <el-card>
      <template #header>
        <div class="header">
          <span>活动申请管理</span>
        </div>
      </template>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索申请人或活动名称"
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
        <el-select v-model="filterActivity" placeholder="活动筛选" clearable style="width: 200px; margin-left: 12px">
          <el-option label="全部活动" value="" />
          <el-option label="篮球友谊赛" value="篮球友谊赛" />
          <el-option label="足球训练营" value="足球训练营" />
          <el-option label="羽毛球比赛" value="羽毛球比赛" />
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
      <el-table :data="paginatedApplications" stripe style="margin-top: 20px">
        <el-table-column prop="image" label="活动封面" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="活动名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="contact" label="联系方式" width="120" />
        <el-table-column prop="category" label="活动分类" width="100">
          <template #default="{ row }">
            {{ getCategoryLabel(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="time" label="活动时间" width="160" />
        <el-table-column prop="venue" label="活动场地" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.venue }}{{ row.area ? ` - ${row.area}` : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="maxParticipants" label="最大人数" width="100">
          <template #default="{ row }">
            {{ row.maxParticipants }}人
          </template>
        </el-table-column>
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
      title="活动申请详情"
      width="800px"
    >
      <div class="application-detail" v-if="currentApplication">
        <!-- 活动封面 -->
        <div class="detail-section">
          <el-image
            :src="currentApplication.image"
            fit="cover"
            style="width: 100%; height: 300px; border-radius: 8px"
            :preview-src-list="[currentApplication.image]"
          />
        </div>

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
                <span class="label">联系邮箱：</span>
                <span class="value">{{ currentApplication.email }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">学号/工号：</span>
                <span class="value">{{ currentApplication.studentId }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 活动信息 -->
        <div class="detail-section">
          <h3 class="section-title">活动信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动名称：</span>
                <span class="value">{{ currentApplication.title }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动分类：</span>
                <span class="value">{{ getCategoryLabel(currentApplication.category) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动时间：</span>
                <span class="value">{{ currentApplication.time }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动场地：</span>
                <span class="value">{{ currentApplication.venue }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">最大人数：</span>
                <span class="value">{{ currentApplication.maxParticipants }}人</span>
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
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">申请时间：</span>
                <span class="value">{{ currentApplication.applyTime }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 活动详情 -->
        <div class="detail-section" v-if="currentApplication.description">
          <h3 class="section-title">活动详情</h3>
          <p class="description-text">{{ currentApplication.description }}</p>
        </div>

        <!-- 活动须知 -->
        <div class="detail-section" v-if="currentApplication.notice">
          <h3 class="section-title">活动须知</h3>
          <ul class="notice-list">
            <li v-for="(item, index) in currentApplication.notice.split('\n')" :key="index">{{ item }}</li>
          </ul>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getActivityPage, approveActivity, deleteActivity, getActivityById } from '@/api/activity'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterActivity = ref('')
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

// 加载活动申请列表（只显示私人活动的审核申请）
const loadApplications = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined,
      approvalStatus: filterStatus.value || undefined,
      activityType: 'private' // 只查询私人活动
    }
    const res = await getActivityPage(params)
    
    // 转换数据格式
    applications.value = res.data.records.map(item => ({
      ...item,
      applicant: item.creatorName || '未知',
      contact: item.creatorPhone || '-',
      email: item.creatorEmail || '-',
      studentId: item.creatorStudentId || '-',
      time: formatDateTime(item.activityTime),
      venue: item.areaName || item.venueName || '待定',
      applyTime: formatDateTime(item.createTime),
      status: item.approvalStatus // pending, approved, rejected
    }))
    
    total.value = res.data.total
  } catch (error) {
    console.error('加载活动申请列表失败:', error)
    ElMessage.error('加载活动申请列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  const date = new Date(dateTimeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 初始化加载
onMounted(() => {
  loadApplications()
})

const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const matchKeyword = !searchKeyword.value || 
      app.applicant.includes(searchKeyword.value) || 
      app.title.includes(searchKeyword.value)
    const matchStatus = !filterStatus.value || app.status === filterStatus.value
    const matchActivity = !filterActivity.value || app.title === filterActivity.value
    const matchDate = !filterDate.value || app.time.startsWith(formatDate(filterDate.value))
    return matchKeyword && matchStatus && matchActivity && matchDate
  })
})

// 分页后的数据
const paginatedApplications = computed(() => {
  return filteredApplications.value
})

const categoryMap = {
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

const getCategoryLabel = (category) => {
  return categoryMap[category] || '其他'
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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

const handleApprove = (row) => {
  ElMessageBox.confirm(
    `确定通过"${row.applicant}"的活动申请吗？`,
    '确认通过',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(async () => {
    try {
      loading.value = true
      await approveActivity(row.id, true)
      ElMessage.success('申请已通过')
      detailVisible.value = false
      loadApplications()
    } catch (error) {
      console.error('审核失败:', error)
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
        await approveActivity(rejectingApplication.value.id, false)
        rejectVisible.value = false
        detailVisible.value = false
        ElMessage.success('申请已拒绝')
        loadApplications()
      } catch (error) {
        console.error('审核失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

const handleViewDetail = async (row) => {
  try {
    loading.value = true
    const res = await getActivityById(row.id)
    currentApplication.value = {
      ...res.data,
      applicant: res.data.creatorName || '未知',
      contact: res.data.creatorPhone || '-',
      email: res.data.creatorEmail || '-',
      studentId: res.data.creatorStudentId || '-',
      time: formatDateTime(res.data.activityTime),
      venue: res.data.areaName || res.data.venueName || '待定',
      applyTime: formatDateTime(res.data.createTime),
      status: res.data.approvalStatus
    }
    detailVisible.value = true
  } catch (error) {
    console.error('加载活动详情失败:', error)
    ElMessage.error('加载活动详情失败')
  } finally {
    loading.value = false
  }
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
      await deleteActivity(row.id)
      ElMessage.success('记录删除成功')
      if (currentApplication.value?.id === row.id) {
        detailVisible.value = false
      }
      loadApplications()
    } catch (error) {
      console.error('删除失败:', error)
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
