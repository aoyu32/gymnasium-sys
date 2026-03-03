<template>
  <div class="my-activities-management">
    <el-card>
      <template #header>
        <div class="header">
          <span>我的活动管理</span>
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
          <el-option label="周末篮球友谊赛" value="周末篮球友谊赛" />
          <el-option label="羽毛球训练营" value="羽毛球训练营" />
          <el-option label="乒乓球比赛" value="乒乓球比赛" />
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
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="email" label="联系邮箱" width="180" show-overflow-tooltip />
        <el-table-column prop="studentId" label="学号/工号" width="120" />
        <el-table-column prop="activityName" label="活动名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="college" label="所属学院" width="130" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.approvalStatus)" size="small">
              {{ getStatusText(row.approvalStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div style="display: flex; gap: 8px; flex-wrap: nowrap; white-space: nowrap;">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
              <template v-if="row.approvalStatus === 'pending'">
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
                <span class="value">{{ currentApplication.phone }}</span>
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
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">所属学院：</span>
                <span class="value">{{ currentApplication.college }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 活动信息 -->
        <div class="detail-section">
          <h3 class="section-title">活动信息</h3>
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="detail-item">
                <span class="label">活动名称：</span>
                <span class="value">{{ currentApplication.activityName }}</span>
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
                <span class="label">申请状态：</span>
                <el-tag :type="getStatusType(currentApplication.approvalStatus)" size="small">
                  {{ getStatusText(currentApplication.approvalStatus) }}
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

        <!-- 申请理由 -->
        <div class="detail-section" v-if="currentApplication.reason">
          <h3 class="section-title">申请理由</h3>
          <p class="description-text">{{ currentApplication.reason }}</p>
        </div>

        <!-- 拒绝原因 -->
        <div class="detail-section" v-if="currentApplication.rejectReason">
          <h3 class="section-title">拒绝原因</h3>
          <p class="description-text">{{ currentApplication.rejectReason }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <template v-if="currentApplication && currentApplication.approvalStatus === 'pending'">
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
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getAllMyActivityRegistrations, approveRegistration } from '@/api/activity'

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

// 加载我的活动的报名申请列表
const loadApplications = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined,
      approvalStatus: filterStatus.value || undefined
    }
    console.log('查询参数:', params)
    const res = await getAllMyActivityRegistrations(params)
    console.log('后端返回数据:', res.data)
    
    // 转换数据格式
    applications.value = res.data.records.map(item => ({
      ...item,
      applicant: item.userName || '未知',
      phone: item.userPhone || '-',
      email: item.userEmail || '-',
      studentId: item.studentId || '-',
      college: item.college || '-',
      activityName: item.activityName || '未知活动',
      status: item.approvalStatus, // pending, approved, rejected
      applyTime: formatDateTime(item.createdAt)
    }))
    
    console.log('转换后的数据:', applications.value)
    total.value = res.data.total
  } catch (error) {
    console.error('加载报名申请列表失败:', error)
    ElMessage.error('加载报名申请列表失败')
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

// 监听搜索和筛选条件变化
watch([searchKeyword, filterStatus], () => {
  currentPage.value = 1
  loadApplications()
})

const filteredApplications = computed(() => {
  // 后端已经做了分页和基本筛选，这里只做前端的额外筛选
  return applications.value.filter(app => {
    const matchActivity = !filterActivity.value || app.activityName === filterActivity.value
    const matchDate = !filterDate.value || app.applyTime.startsWith(formatDate(filterDate.value))
    return matchActivity && matchDate
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
      await approveRegistration(row.activityId, row.userId, true)
      ElMessage.success('申请已通过')
      detailVisible.value = false
      loadApplications()
    } catch (error) {
      console.error('审核失败:', error)
      ElMessage.error('审核失败')
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
        await approveRegistration(rejectingApplication.value.activityId, rejectingApplication.value.userId, false)
        rejectVisible.value = false
        detailVisible.value = false
        ElMessage.success('申请已拒绝')
        loadApplications()
      } catch (error) {
        console.error('审核失败:', error)
        ElMessage.error('审核失败')
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
      // 这里可以调用删除报名记录的API
      // 暂时使用拒绝来代替删除
      await approveRegistration(row.activityId, row.userId, false)
      ElMessage.success('记录删除成功')
      if (currentApplication.value?.id === row.id) {
        detailVisible.value = false
      }
      loadApplications()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
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
@use './styles/my-activities.scss';
</style>
