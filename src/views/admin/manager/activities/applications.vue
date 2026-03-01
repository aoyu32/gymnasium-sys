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
                <span class="value">{{ currentApplication.venue }}{{ currentApplication.area ? ` - ${currentApplication.area}` : '' }}</span>
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
          <p class="description-text">{{ currentApplication.notice }}</p>
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
    contact: '13800138001',
    email: 'zhangsan@example.com',
    studentId: '2021001',
    title: '班级篮球友谊赛',
    category: 'basketball',
    time: '2026-03-05 14:00',
    venue: '篮球馆',
    area: 'A场',
    maxParticipants: 20,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    description: '组织班级篮球友谊赛，增进同学之间的友谊',
    notice: '请提前15分钟到达，自备运动装备',
    status: 'pending',
    applyTime: '2026-03-01 10:30'
  },
  {
    id: 2,
    applicant: '李四',
    contact: '13800138002',
    email: 'lisi@example.com',
    studentId: '2021002',
    title: '羽毛球训练营',
    category: 'badminton',
    time: '2026-03-06 16:00',
    venue: '羽毛球馆',
    area: '1号场地',
    maxParticipants: 16,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
    description: '羽毛球爱好者训练营，提高技术水平',
    notice: '请自备球拍和运动鞋',
    status: 'approved',
    applyTime: '2026-02-28 15:20'
  },
  {
    id: 3,
    applicant: '王五',
    contact: '13800138003',
    email: 'wangwu@example.com',
    studentId: '2021003',
    title: '网球双打赛',
    category: 'tennis',
    time: '2026-03-07 09:00',
    venue: '网球场',
    area: '1号场地',
    maxParticipants: 8,
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
    description: '网球双打比赛，欢迎网球爱好者参加',
    notice: '请自备球拍，场地提供网球',
    status: 'pending',
    applyTime: '2026-03-01 11:00'
  },
  {
    id: 4,
    applicant: '赵六',
    contact: '13800138004',
    email: 'zhaoliu@example.com',
    studentId: '2021004',
    title: '乒乓球比赛',
    category: 'tabletennis',
    time: '2026-03-08 14:00',
    venue: '乒乓球室',
    area: '全场',
    maxParticipants: 12,
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400',
    description: '乒乓球友谊赛，切磋球技',
    notice: '请自备球拍',
    status: 'rejected',
    applyTime: '2026-03-01 09:00',
    rejectReason: '该时段场地已被预约，建议更换时间'
  },
  {
    id: 5,
    applicant: '孙七',
    contact: '13800138005',
    email: 'sunqi@example.com',
    studentId: '2021005',
    title: '台球比赛',
    category: 'other',
    time: '2026-03-09 19:00',
    venue: '台球室',
    area: '全场',
    maxParticipants: 10,
    image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=400',
    description: '台球爱好者交流赛',
    notice: '场地提供球杆和台球',
    status: 'pending',
    applyTime: '2026-03-01 13:30'
  }
])

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
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredApplications.value.slice(start, end)
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
@use './styles/applications.scss';
</style>
