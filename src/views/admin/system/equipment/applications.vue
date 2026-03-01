<template>
  <div class="system-equipment-applications">
    <el-card>
      <template #header>
        <span>器材申请管理</span>
      </template>

      <!-- 搜索筛选 -->
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索器材名称或申请人"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCategory" placeholder="分类" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="球类" value="球类" />
          <el-option label="球拍" value="球拍" />
          <el-option label="护具" value="护具" />
          <el-option label="健身器材" value="健身器材" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="待审批" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
      </div>

      <!-- 申请列表 -->
      <el-table :data="paginatedApplications" stripe style="margin-top: 20px">
        <el-table-column prop="equipmentName" label="器材名称" min-width="150" />
        <el-table-column prop="category" label="分类" min-width="100" />
        <el-table-column prop="brand" label="品牌" min-width="120" />
        <el-table-column prop="model" label="型号" min-width="120" />
        <el-table-column prop="quantity" label="申请数量" min-width="100" align="center">
          <template #default="{ row }">
            <span style="color: #1890ff; font-weight: 500;">{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" min-width="100" />
        <el-table-column prop="applyTime" label="申请时间" min-width="160" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'pending'" type="warning">待审批</el-tag>
            <el-tag v-else-if="row.status === 'approved'" type="success">已通过</el-tag>
            <el-tag v-else type="danger">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
            <template v-if="row.status === 'pending'">
              <el-button link type="success" size="small" @click="handleApprove(row)">通过入库</el-button>
              <el-button link type="danger" size="small" @click="handleReject(row)">拒绝</el-button>
            </template>
            <template v-else-if="row.status === 'rejected'">
              <el-button link type="success" size="small" @click="handleReApprove(row)">重新通过入库</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredApplications.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 申请详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="申请详情"
      width="700px"
    >
      <div v-if="currentApplication" class="application-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="器材名称">{{ currentApplication.equipmentName }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ currentApplication.category }}</el-descriptions-item>
          <el-descriptions-item label="品牌">{{ currentApplication.brand }}</el-descriptions-item>
          <el-descriptions-item label="型号">{{ currentApplication.model }}</el-descriptions-item>
          <el-descriptions-item label="申请数量">
            <span style="color: #1890ff; font-weight: 500;">{{ currentApplication.quantity }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="申请人">{{ currentApplication.applicant }}</el-descriptions-item>
          <el-descriptions-item label="申请时间" :span="2">{{ currentApplication.applyTime }}</el-descriptions-item>
          <el-descriptions-item label="申请理由" :span="2">
            <div class="reason-content">{{ currentApplication.reason }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="状态" :span="2">
            <el-tag v-if="currentApplication.status === 'pending'" type="warning">待审批</el-tag>
            <el-tag v-else-if="currentApplication.status === 'approved'" type="success">已通过</el-tag>
            <el-tag v-else type="danger">已拒绝</el-tag>
          </el-descriptions-item>
          <template v-if="currentApplication.status === 'approved'">
            <el-descriptions-item label="审批时间">{{ currentApplication.approveTime }}</el-descriptions-item>
            <el-descriptions-item label="审批人">{{ currentApplication.approver }}</el-descriptions-item>
          </template>
          <template v-if="currentApplication.status === 'rejected'">
            <el-descriptions-item label="拒绝时间">{{ currentApplication.rejectTime }}</el-descriptions-item>
            <el-descriptions-item label="拒绝原因" :span="2">{{ currentApplication.rejectReason }}</el-descriptions-item>
          </template>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button v-if="currentApplication?.status === 'pending'" type="success" @click="handleApproveFromDetail">通过入库</el-button>
        <el-button v-if="currentApplication?.status === 'pending'" type="danger" @click="handleRejectFromDetail">拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const detailDialogVisible = ref(false)
const currentApplication = ref(null)

const allApplications = ref([
  {
    id: 1,
    equipmentName: '篮球',
    category: '球类',
    brand: '斯伯丁',
    model: 'NBA官方用球',
    quantity: 20,
    applicant: '刘老师',
    reason: '现有篮球磨损严重，需要补充新球以满足日常教学和比赛需求',
    applyTime: '2026-03-01 10:30',
    status: 'pending'
  },
  {
    id: 2,
    equipmentName: '羽毛球拍',
    category: '球拍',
    brand: '尤尼克斯',
    model: 'YONEX VT-ZF2',
    quantity: 15,
    applicant: '陈老师',
    reason: '学生借用需求增加，现有球拍数量不足',
    applyTime: '2026-03-01 14:20',
    status: 'pending'
  },
  {
    id: 3,
    equipmentName: '护膝',
    category: '护具',
    brand: '李宁',
    model: 'LINING-KP01',
    quantity: 30,
    applicant: '王老师',
    reason: '运动安全需要，为学生提供更好的保护',
    applyTime: '2026-02-28 09:15',
    status: 'pending'
  },
  {
    id: 4,
    equipmentName: '足球',
    category: '球类',
    brand: '阿迪达斯',
    model: 'Adidas Tango',
    quantity: 10,
    applicant: '李老师',
    reason: '足球场使用频繁，需要补充新球',
    applyTime: '2026-02-25 11:00',
    approveTime: '2026-02-26 09:30',
    approver: '系统管理员',
    status: 'approved'
  },
  {
    id: 5,
    equipmentName: '跑步机',
    category: '健身器材',
    brand: '舒华',
    model: 'SH-T5500',
    quantity: 5,
    applicant: '赵老师',
    reason: '健身房需要增加跑步机设备',
    applyTime: '2026-02-20 15:00',
    rejectTime: '2026-02-21 10:00',
    rejectReason: '预算不足，暂不采购',
    status: 'rejected'
  },
  {
    id: 6,
    equipmentName: '乒乓球拍',
    category: '球拍',
    brand: '红双喜',
    model: 'DHS-R6002',
    quantity: 12,
    applicant: '周老师',
    reason: '乒乓球馆器材老化，需要更新',
    applyTime: '2026-02-27 16:00',
    approveTime: '2026-02-28 10:00',
    approver: '系统管理员',
    status: 'approved'
  }
])

const filteredApplications = computed(() => {
  let result = [...allApplications.value]
  
  if (searchKeyword.value) {
    result = result.filter(a => 
      a.equipmentName.includes(searchKeyword.value) || 
      a.applicant.includes(searchKeyword.value)
    )
  }
  
  if (filterCategory.value) {
    result = result.filter(a => a.category === filterCategory.value)
  }

  if (filterStatus.value) {
    result = result.filter(a => a.status === filterStatus.value)
  }
  
  return result
})

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredApplications.value.slice(start, start + pageSize.value)
})

const handleViewDetail = (row) => {
  currentApplication.value = row
  detailDialogVisible.value = true
}

const handleApprove = (row) => {
  ElMessageBox.confirm('确定通过该申请吗？通过后器材将自动入库。', '提示', {
    type: 'success'
  }).then(() => {
    row.status = 'approved'
    row.approveTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
    row.approver = '系统管理员'
    ElMessage.success('审批通过，器材已入库')
  }).catch(() => {})
}

const handleReject = (row) => {
  ElMessageBox.prompt('请输入拒绝原因', '拒绝申请', {
    inputPattern: /.+/,
    inputErrorMessage: '请输入拒绝原因'
  }).then(({ value }) => {
    row.status = 'rejected'
    row.rejectTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
    row.rejectReason = value
    ElMessage.success('已拒绝')
  }).catch(() => {})
}

const handleReApprove = (row) => {
  ElMessageBox.confirm('确定重新通过该申请并入库吗？', '提示', {
    type: 'success'
  }).then(() => {
    row.status = 'approved'
    row.approveTime = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
    row.approver = '系统管理员'
    delete row.rejectTime
    delete row.rejectReason
    ElMessage.success('审批通过，器材已入库')
  }).catch(() => {})
}

const handleApproveFromDetail = () => {
  detailDialogVisible.value = false
  handleApprove(currentApplication.value)
}

const handleRejectFromDetail = () => {
  detailDialogVisible.value = false
  handleReject(currentApplication.value)
}
</script>

<style lang="scss" scoped>
@use './styles/applications.scss';
</style>
