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
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCategory" placeholder="分类" clearable style="width: 150px" @change="handleSearch">
          <el-option label="全部" value="" />
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" style="width: 150px" @change="handleSearch">
          <el-option label="全部" value="" />
          <el-option label="待审批" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <!-- 申请列表 -->
      <el-table :data="paginatedApplications" stripe style="margin-top: 20px" v-loading="loading">
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
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
            <template v-if="row.status === 'pending'">
              <el-button link type="success" size="small" @click="handleApprove(row)">通过入库</el-button>
              <el-button link type="danger" size="small" @click="handleReject(row)">拒绝</el-button>
            </template>
            <template v-else-if="row.status === 'rejected'">
              <el-button link type="success" size="small" @click="handleReApprove(row)">重新通过入库</el-button>
            </template>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadApplications"
          @current-change="loadApplications"
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { 
  getPurchaseList, 
  getPurchaseDetail, 
  approvePurchase, 
  rejectPurchase,
  deletePurchase
} from '@/api/admin/equipment-purchase'
import { getCategoryList } from '@/api/admin/equipment-category'

const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const currentApplication = ref(null)
const loading = ref(false)
const categories = ref([])

const allApplications = ref([])

const filteredApplications = computed(() => allApplications.value)

const paginatedApplications = computed(() => allApplications.value)

// 加载器材分类列表
const loadCategories = async () => {
  try {
    const res = await getCategoryList({})
    if (res.code === 200) {
      categories.value = res.data
    }
  } catch (error) {
    console.error('加载器材分类失败:', error)
  }
}

// 加载器材进货申请列表
const loadApplications = async () => {
  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value,
      categoryId: filterCategory.value,
      status: filterStatus.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    
    const res = await getPurchaseList(params)
    if (res.code === 200) {
      allApplications.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    console.error('加载器材进货申请列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadApplications()
}

const handleViewDetail = async (row) => {
  try {
    const res = await getPurchaseDetail(row.id)
    if (res.code === 200) {
      currentApplication.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('加载申请详情失败:', error)
  }
}

const handleApprove = async (row) => {
  try {
    await ElMessageBox.confirm('确定通过该申请吗？通过后器材将自动入库。', '提示', {
      type: 'success'
    })
    
    const res = await approvePurchase(row.id)
    if (res.code === 200) {
      ElMessage.success('审批通过，器材已入库')
      loadApplications()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('审批通过失败:', error)
    }
  }
}

const handleReject = async (row) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝申请', {
      inputPattern: /.+/,
      inputErrorMessage: '请输入拒绝原因'
    })
    
    const res = await rejectPurchase(row.id, { rejectReason: value })
    if (res.code === 200) {
      ElMessage.success('已拒绝')
      loadApplications()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('拒绝申请失败:', error)
    }
  }
}

const handleReApprove = async (row) => {
  try {
    await ElMessageBox.confirm('确定重新通过该申请并入库吗？', '提示', {
      type: 'success'
    })
    
    const res = await approvePurchase(row.id)
    if (res.code === 200) {
      ElMessage.success('审批通过，器材已入库')
      loadApplications()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重新审批通过失败:', error)
    }
  }
}

const handleApproveFromDetail = () => {
  detailDialogVisible.value = false
  handleApprove(currentApplication.value)
}

const handleRejectFromDetail = () => {
  detailDialogVisible.value = false
  handleReject(currentApplication.value)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该申请记录吗？删除后将无法恢复。', '提示', {
      type: 'warning'
    })
    
    const res = await deletePurchase(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadApplications()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除申请记录失败:', error)
    }
  }
}

onMounted(() => {
  loadCategories()
  loadApplications()
})
</script>

<style lang="scss" scoped>
@use './styles/applications.scss';
</style>
