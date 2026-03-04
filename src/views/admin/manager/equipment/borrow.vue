<template>
  <div class="equipment-borrow-management">
    <el-card>
      <template #header>
        <div class="header">
          <span>器材借用管理</span>
        </div>
      </template>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索借用人或器材名称"
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
          <el-option label="借用中" value="borrowed" />
          <el-option label="已归还" value="returned" />
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
        <el-table-column prop="borrower" label="借用人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="studentId" label="学号/工号" width="120" />
        <el-table-column prop="equipmentName" label="器材名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="brandInfo" label="品牌规格" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.brandName ? `${row.brandName} ${row.brandModel || ''}` : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="借用数量" width="100">
          <template #default="{ row }">
            {{ row.quantity }}件
          </template>
        </el-table-column>
        <el-table-column prop="days" label="借用天数" width="100">
          <template #default="{ row }">
            {{ row.days }}天
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
              <template v-else-if="row.status === 'approved'">
                <el-button link type="warning" size="small" @click="handleCancelApprove(row)">取消通过</el-button>
              </template>
              <template v-else-if="row.status === 'rejected'">
                <el-button link type="success" size="small" @click="handleApprove(row)">重新通过</el-button>
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
      title="借用申请详情"
      width="700px"
    >
      <div class="application-detail" v-if="currentApplication">
        <!-- 借用人信息 -->
        <div class="detail-section">
          <h3 class="section-title">借用人信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">借用人姓名：</span>
                <span class="value">{{ currentApplication.borrower }}</span>
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
                <span class="label">学号/工号：</span>
                <span class="value">{{ currentApplication.studentId }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 器材信息 -->
        <div class="detail-section">
          <h3 class="section-title">器材信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">器材名称：</span>
                <span class="value">{{ currentApplication.equipmentName }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">品牌规格：</span>
                <span class="value">{{ currentApplication.brandName ? `${currentApplication.brandName} ${currentApplication.brandModel || ''}` : '-' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">借用数量：</span>
                <span class="value">{{ currentApplication.quantity }}件</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">借用天数：</span>
                <span class="value">{{ currentApplication.days }}天</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">预计归还日期：</span>
                <span class="value">{{ currentApplication.expectedReturnDate }}</span>
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

        <!-- 借用理由 -->
        <div class="detail-section" v-if="currentApplication.reason">
          <h3 class="section-title">借用理由</h3>
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
        <template v-if="currentApplication && currentApplication.status === 'pending'">
          <el-button type="success" @click="handleApprove(currentApplication)">通过申请</el-button>
          <el-button type="danger" @click="handleReject(currentApplication)">拒绝申请</el-button>
        </template>
        <template v-else-if="currentApplication && currentApplication.status === 'approved'">
          <el-button type="warning" @click="handleCancelApprove(currentApplication)">取消通过</el-button>
        </template>
        <template v-else-if="currentApplication && currentApplication.status === 'rejected'">
          <el-button type="success" @click="handleApprove(currentApplication)">重新通过</el-button>
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
import {
  getBorrowApplicationPage,
  getBorrowApplicationById,
  approveBorrowApplication,
  rejectBorrowApplication,
  deleteBorrowApplication,
  cancelBorrowApplication
} from '@/api/equipment'

const searchKeyword = ref('')
const filterStatus = ref('')
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

// 加载借用申请列表
const loadApplications = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: filterStatus.value
    }
    const res = await getBorrowApplicationPage(params)
    applications.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('加载借用申请列表失败:', error)
    ElMessage.error('加载借用申请列表失败')
  } finally {
    loading.value = false
  }
}

// 监听搜索条件变化
watch([searchKeyword, filterStatus], () => {
  currentPage.value = 1
  loadApplications()
})

onMounted(() => {
  loadApplications()
})

const filteredApplications = computed(() => {
  let filtered = applications.value
  
  // 日期筛选（前端筛选）
  if (filterDate.value) {
    const dateStr = formatDate(filterDate.value)
    filtered = filtered.filter(app => app.applyTime.startsWith(dateStr))
  }
  
  return filtered
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
    rejected: 'danger',
    borrowed: 'primary',
    returned: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝',
    borrowed: '借用中',
    returned: '已归还'
  }
  return textMap[status] || status
}

const handleApprove = (row) => {
  const actionText = row.status === 'rejected' ? '重新通过' : '通过'
  ElMessageBox.confirm(
    `确定${actionText}"${row.borrower}"的借用申请吗？`,
    `确认${actionText}`,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(async () => {
    try {
      loading.value = true
      await approveBorrowApplication(row.id)
      ElMessage.success(`申请已${actionText}`)
      detailVisible.value = false
      await loadApplications()
    } catch (error) {
      console.error('通过申请失败:', error)
      ElMessage.error(error.message || '通过申请失败')
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

const handleCancelApprove = (row) => {
  ElMessageBox.confirm(
    `确定取消通过"${row.borrower}"的借用申请吗？取消后状态将变为待审批。`,
    '确认取消通过',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      await cancelBorrowApplication(row.id)
      ElMessage.success('已取消通过')
      detailVisible.value = false
      await loadApplications()
    } catch (error) {
      console.error('取消通过失败:', error)
      ElMessage.error(error.message || '取消通过失败')
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
        await rejectBorrowApplication(rejectingApplication.value.id, {
          reason: rejectForm.value.reason
        })
        rejectVisible.value = false
        detailVisible.value = false
        ElMessage.success('申请已拒绝')
        await loadApplications()
      } catch (error) {
        console.error('拒绝申请失败:', error)
        ElMessage.error(error.message || '拒绝申请失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleViewDetail = async (row) => {
  try {
    loading.value = true
    const res = await getBorrowApplicationById(row.id)
    currentApplication.value = res.data
    detailVisible.value = true
  } catch (error) {
    console.error('获取申请详情失败:', error)
    ElMessage.error('获取申请详情失败')
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
      await deleteBorrowApplication(row.id)
      ElMessage.success('记录删除成功')
      if (currentApplication.value?.id === row.id) {
        detailVisible.value = false
      }
      await loadApplications()
    } catch (error) {
      console.error('删除记录失败:', error)
      ElMessage.error(error.message || '删除记录失败')
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
@use './styles/borrow.scss';
</style>
