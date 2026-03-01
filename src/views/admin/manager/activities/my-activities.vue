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
      <el-table :data="paginatedApplications" stripe style="margin-top: 20px">
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="email" label="联系邮箱" width="180" show-overflow-tooltip />
        <el-table-column prop="studentId" label="学号/工号" width="120" />
        <el-table-column prop="activityName" label="活动名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="college" label="所属学院" width="130" show-overflow-tooltip />
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
        :total="filteredApplications.length"
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
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterActivity = ref('')
const filterDate = ref('')
const detailVisible = ref(false)
const rejectVisible = ref(false)
const currentApplication = ref(null)
const rejectingApplication = ref(null)
const rejectFormRef = ref(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

const rejectForm = ref({
  reason: ''
})

const rejectRules = {
  reason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
}

const applications = ref([
  {
    id: 1,
    applicant: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    studentId: '2021001',
    college: '计算机学院',
    activityName: '周末篮球友谊赛',
    status: 'pending',
    applyTime: '2026-03-01 10:30',
    reason: '热爱篮球运动，希望通过活动提高球技并结识更多朋友'
  },
  {
    id: 2,
    applicant: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    studentId: '2021002',
    college: '软件学院',
    activityName: '羽毛球训练营',
    status: 'approved',
    applyTime: '2026-02-28 15:20',
    reason: '想要提高羽毛球技能，参加系统的训练'
  },
  {
    id: 3,
    applicant: '王五',
    phone: '13800138003',
    email: 'wangwu@example.com',
    studentId: '2021003',
    college: '信息学院',
    activityName: '乒乓球比赛',
    status: 'pending',
    applyTime: '2026-03-01 11:00',
    reason: '喜欢乒乓球运动，希望通过比赛锻炼自己'
  },
  {
    id: 4,
    applicant: '赵六',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    studentId: '2021004',
    college: '电子工程学院',
    activityName: '周末篮球友谊赛',
    status: 'rejected',
    applyTime: '2026-03-01 09:00',
    reason: '想参加篮球活动',
    rejectReason: '名额已满，建议关注下次活动'
  },
  {
    id: 5,
    applicant: '孙七',
    phone: '13800138005',
    email: 'sunqi@example.com',
    studentId: '2021005',
    college: '机械工程学院',
    activityName: '羽毛球训练营',
    status: 'pending',
    applyTime: '2026-03-01 13:30',
    reason: '希望提高羽毛球水平，参加专业训练'
  }
])

const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const matchKeyword = !searchKeyword.value || 
      app.applicant.includes(searchKeyword.value) || 
      app.activityName.includes(searchKeyword.value)
    const matchStatus = !filterStatus.value || app.status === filterStatus.value
    const matchActivity = !filterActivity.value || app.activityName === filterActivity.value
    const matchDate = !filterDate.value || app.applyTime.startsWith(formatDate(filterDate.value))
    return matchKeyword && matchStatus && matchActivity && matchDate
  })
})

// 分页后的数据
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredApplications.value.slice(start, end)
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
  ).then(() => {
    row.status = 'approved'
    ElMessage.success('申请已通过')
    detailVisible.value = false
  }).catch(() => {})
}

const handleReject = (row) => {
  rejectingApplication.value = row
  rejectForm.value.reason = ''
  rejectVisible.value = true
}

const confirmReject = async () => {
  if (!rejectFormRef.value) return
  
  await rejectFormRef.value.validate((valid) => {
    if (valid) {
      rejectingApplication.value.status = 'rejected'
      rejectingApplication.value.rejectReason = rejectForm.value.reason
      rejectVisible.value = false
      detailVisible.value = false
      ElMessage.success('申请已拒绝')
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
  ).then(() => {
    const index = applications.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      applications.value.splice(index, 1)
      ElMessage.success('记录删除成功')
      if (currentApplication.value?.id === row.id) {
        detailVisible.value = false
      }
    }
  }).catch(() => {})
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style lang="scss" scoped>
@use './styles/my-activities.scss';
</style>
