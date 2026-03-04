<template>
  <div class="student-equipment">
    <el-tabs v-model="activeTab">
      <!-- 器材借用 -->
      <el-tab-pane label="器材借用" name="borrow">
        <EquipmentFilter
          v-model:filters="filters"
          @reset="handleResetFilter"
        />
        <EquipmentList :equipments="filteredEquipments" />
      </el-tab-pane>

      <!-- 借用记录 -->
      <el-tab-pane label="借用记录" name="records">
        <el-table :data="borrowRecords" stripe>
          <el-table-column prop="equipmentName" label="器材名称" width="120" />
          <el-table-column label="品牌规格" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.brandName ? `${row.brandName} ${row.brandModel || ''}` : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" align="center" />
          <el-table-column prop="borrowDate" label="借用日期" width="120" />
          <el-table-column prop="expectedReturnDate" label="应还日期" width="120" />
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">查看详情</el-button>
              <el-button
                v-if="row.status === 'approved'"
                link
                type="warning"
                size="small"
                @click="handleReturn(row)"
              >
                归还
              </el-button>
              <el-button
                v-if="row.status === 'returning'"
                link
                type="info"
                size="small"
                disabled
              >
                审核中
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

    <!-- 借用详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="借用详情"
      width="600px"
    >
      <el-descriptions :column="1" border v-if="currentRecord">
        <el-descriptions-item label="器材名称">{{ currentRecord.equipmentName }}</el-descriptions-item>
        <el-descriptions-item label="品牌规格">
          {{ currentRecord.brandName ? `${currentRecord.brandName} ${currentRecord.brandModel || ''}` : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="借用数量">{{ currentRecord.quantity }}件</el-descriptions-item>
        <el-descriptions-item label="借用日期">{{ currentRecord.borrowDate }}</el-descriptions-item>
        <el-descriptions-item label="应还日期">{{ currentRecord.expectedReturnDate }}</el-descriptions-item>
        <el-descriptions-item label="借用人">{{ currentRecord.borrower }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentRecord.phone }}</el-descriptions-item>
        <el-descriptions-item label="学号/工号">{{ currentRecord.studentId }}</el-descriptions-item>
        <el-descriptions-item label="借用理由">{{ currentRecord.reason }}</el-descriptions-item>
        <el-descriptions-item label="借用状态">
          <el-tag :type="getStatusType(currentRecord.status)">{{ getStatusText(currentRecord.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentRecord.status === 'returned'" label="归还日期">
          {{ currentRecord.actualReturnDate || '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="goToEquipmentDetail">查看器材详情</el-button>
      </template>
    </el-dialog>

    <!-- 归还对话框 -->
    <el-dialog
      v-model="returnDialogVisible"
      title="归还器材"
      width="600px"
    >
      <el-form
        ref="returnFormRef"
        :model="returnForm"
        :rules="returnRules"
        label-width="120px"
      >
        <el-form-item label="器材名称">
          <el-input v-model="currentReturnRecord.equipmentName" disabled />
        </el-form-item>
        <el-form-item label="品牌规格">
          <el-input v-model="currentReturnRecord.brand" disabled />
        </el-form-item>
        <el-form-item label="借用数量">
          <el-input v-model="currentReturnRecord.quantity" disabled>
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="上传器材照片" prop="images" required>
          <el-upload
            v-model:file-list="returnForm.images"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                请上传器材照片，最多3张，用于验证器材完好性
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="器材状态" prop="condition">
          <el-radio-group v-model="returnForm.condition">
            <el-radio value="good">完好无损</el-radio>
            <el-radio value="normal">轻微磨损</el-radio>
            <el-radio value="damaged">有损坏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input
            v-model="returnForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请说明器材使用情况或损坏情况（如有）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="returnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReturn">提交归还申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import EquipmentFilter from './components/EquipmentFilter.vue'
import EquipmentList from './components/EquipmentList.vue'
import { getEquipmentPage, getMyBorrowRecords, deleteBorrowApplication, createReturnApplication } from '@/api/equipment'

const router = useRouter()
const activeTab = ref('borrow')
const detailDialogVisible = ref(false)
const returnDialogVisible = ref(false)
const currentRecord = ref(null)
const currentReturnRecord = ref({})
const returnFormRef = ref(null)

const filters = ref({
  searchKeyword: '',
  category: '',
  status: ''
})

// 器材列表
const equipments = ref([])
const loading = ref(false)

// 归还表单
const returnForm = ref({
  images: [],
  condition: 'good',
  remark: ''
})

const returnRules = {
  images: [
    { required: true, message: '请上传器材照片', trigger: 'change' }
  ],
  condition: [
    { required: true, message: '请选择器材状态', trigger: 'change' }
  ]
}

// 加载器材列表
const loadEquipments = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: 1,
      pageSize: 100,
      keyword: filters.value.searchKeyword,
      category: filters.value.category
    }
    const res = await getEquipmentPage(params)
    equipments.value = res.data.records || []
  } catch (error) {
    console.error('加载器材列表失败:', error)
    ElMessage.error('加载器材列表失败')
  } finally {
    loading.value = false
  }
}

// 监听过滤条件变化
watch(() => [filters.value.searchKeyword, filters.value.category], () => {
  loadEquipments()
}, { deep: true })

// 筛选后的器材列表
const filteredEquipments = computed(() => {
  let result = [...equipments.value]
  
  // 状态筛选（前端筛选）
  if (filters.value.status) {
    if (filters.value.status === 'available') {
      result = result.filter(item => item.stock > 0)
    } else if (filters.value.status === 'unavailable') {
      result = result.filter(item => item.stock === 0)
    }
  }
  
  return result
})

const borrowRecords = ref([])

// 加载借用记录
const loadBorrowRecords = async () => {
  try {
    const res = await getMyBorrowRecords()
    borrowRecords.value = res.data || []
  } catch (error) {
    console.error('加载借用记录失败:', error)
    ElMessage.error('加载借用记录失败')
  }
}

onMounted(() => {
  loadEquipments()
  loadBorrowRecords()
})

const handleResetFilter = () => {
  filters.value = {
    searchKeyword: '',
    category: '',
    status: ''
  }
  loadEquipments()
}

const handleViewDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

const goToEquipmentDetail = () => {
  if (currentRecord.value) {
    detailDialogVisible.value = false
    router.push(`/student/equipment/${currentRecord.value.equipmentId}`)
  }
}

const handleReturn = (row) => {
  currentReturnRecord.value = { 
    ...row,
    brand: row.brandName ? `${row.brandName} ${row.brandModel || ''}` : '-'
  }
  returnForm.value = {
    images: [],
    condition: 'good',
    remark: ''
  }
  returnDialogVisible.value = true
}

const confirmReturn = async () => {
  if (!returnFormRef.value) return
  
  await returnFormRef.value.validate(async (valid) => {
    if (valid) {
      if (returnForm.value.images.length === 0) {
        ElMessage.warning('请上传器材照片')
        return
      }
      
      try {
        // 提取图片URL（实际项目中需要先上传图片到服务器）
        const imageUrls = returnForm.value.images.map(file => {
          // 如果是文件对象，需要上传后获取URL
          // 这里暂时使用模拟URL
          return file.url || 'https://via.placeholder.com/400'
        })
        
        await createReturnApplication({
          borrowId: currentReturnRecord.value.id,
          condition: returnForm.value.condition,
          remark: returnForm.value.remark,
          images: imageUrls
        })
        
        ElMessage.success('归还申请已提交，请等待审核')
        returnDialogVisible.value = false
        
        // 重新加载借用记录
        loadBorrowRecords()
      } catch (error) {
        console.error('提交归还申请失败:', error)
        ElMessage.error('提交归还申请失败')
      }
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该借用记录吗？删除后将无法恢复。', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteBorrowApplication(row.id)
      ElMessage.success('已删除记录')
      loadBorrowRecords()
    } catch (error) {
      console.error('删除记录失败:', error)
      ElMessage.error('删除记录失败')
    }
  }).catch(() => {})
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'info',
    approved: 'success',
    rejected: 'danger',
    returning: 'warning',
    returned: 'success'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝',
    returning: '归还审核中',
    returned: '已归还'
  }
  return textMap[status] || status
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
