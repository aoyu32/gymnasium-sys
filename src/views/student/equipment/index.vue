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
          <el-table-column prop="brand" label="品牌规格" min-width="180" show-overflow-tooltip />
          <el-table-column prop="quantity" label="数量" width="80" align="center" />
          <el-table-column prop="borrowDate" label="借用日期" width="120" />
          <el-table-column prop="returnDate" label="应还日期" width="120" />
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">查看详情</el-button>
              <el-button
                v-if="row.status === 'borrowed'"
                link
                type="danger"
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
        <el-descriptions-item label="品牌规格">{{ currentRecord.brand }}</el-descriptions-item>
        <el-descriptions-item label="借用数量">{{ currentRecord.quantity }}件</el-descriptions-item>
        <el-descriptions-item label="借用日期">{{ currentRecord.borrowDate }}</el-descriptions-item>
        <el-descriptions-item label="应还日期">{{ currentRecord.returnDate }}</el-descriptions-item>
        <el-descriptions-item label="借用人">{{ currentRecord.borrower || '张三' }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentRecord.phone || '13800138000' }}</el-descriptions-item>
        <el-descriptions-item label="学号/工号">{{ currentRecord.studentId || '2021001' }}</el-descriptions-item>
        <el-descriptions-item label="借用理由">{{ currentRecord.reason || '体育课使用' }}</el-descriptions-item>
        <el-descriptions-item label="借用状态">
          <el-tag :type="getStatusType(currentRecord.status)">{{ currentRecord.statusText }}</el-tag>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import EquipmentFilter from './components/EquipmentFilter.vue'
import EquipmentList from './components/EquipmentList.vue'
import { equipments } from '@/mock/equipments'

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

// 筛选后的器材列表
const filteredEquipments = computed(() => {
  let result = [...equipments]
  
  // 搜索筛选
  if (filters.value.searchKeyword) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(filters.value.searchKeyword.toLowerCase())
    )
  }
  
  // 分类筛选
  if (filters.value.category) {
    result = result.filter(item => item.category === filters.value.category)
  }
  
  // 状态筛选
  if (filters.value.status) {
    if (filters.value.status === 'available') {
      result = result.filter(item => item.stock > 0)
    } else if (filters.value.status === 'unavailable') {
      result = result.filter(item => item.stock === 0)
    }
  }
  
  return result
})

const borrowRecords = ref([
  {
    id: 1,
    equipmentId: 1,
    equipmentName: '篮球',
    brand: '斯伯丁 NBA官方用球',
    quantity: 2,
    borrowDate: '2026-02-20',
    returnDate: '2026-02-27',
    status: 'borrowed',
    statusText: '借用中',
    borrower: '张三',
    phone: '13800138000',
    studentId: '2021001',
    reason: '班级篮球比赛使用'
  },
  {
    id: 2,
    equipmentId: 2,
    equipmentName: '羽毛球拍',
    brand: '尤尼克斯 NANORAY系列',
    quantity: 1,
    borrowDate: '2026-02-15',
    returnDate: '2026-02-22',
    status: 'returned',
    statusText: '已归还',
    borrower: '李四',
    phone: '13900139000',
    studentId: '2021002',
    reason: '体育课使用',
    actualReturnDate: '2026-02-21'
  },
  {
    id: 3,
    equipmentId: 4,
    equipmentName: '足球',
    brand: '阿迪达斯 世界杯用球',
    quantity: 1,
    borrowDate: '2026-02-10',
    returnDate: '2026-02-17',
    status: 'overdue',
    statusText: '已逾期',
    borrower: '王五',
    phone: '13700137000',
    studentId: '2021003',
    reason: '足球社团训练'
  }
])

const handleResetFilter = () => {
  filters.value = {
    searchKeyword: '',
    category: '',
    status: ''
  }
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
  currentReturnRecord.value = { ...row }
  returnForm.value = {
    images: [],
    condition: 'good',
    remark: ''
  }
  returnDialogVisible.value = true
}

const confirmReturn = async () => {
  if (!returnFormRef.value) return
  
  await returnFormRef.value.validate((valid) => {
    if (valid) {
      if (returnForm.value.images.length === 0) {
        ElMessage.warning('请上传器材照片')
        return
      }
      
      ElMessage.success('归还申请已提交，请等待审核')
      returnDialogVisible.value = false
      
      // 更新记录状态为审核中
      const record = borrowRecords.value.find(item => item.id === currentReturnRecord.value.id)
      if (record) {
        record.status = 'returning'
        record.statusText = '归还审核中'
      }
      
      // 这里后期对接API，上传照片和表单数据
      console.log('归还信息:', {
        ...currentReturnRecord.value,
        ...returnForm.value
      })
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该借用记录吗？删除后将无法恢复。', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = borrowRecords.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      borrowRecords.value.splice(index, 1)
      ElMessage.success('已删除记录')
    }
    // 这里后期对接API
  }).catch(() => {})
}

const getStatusType = (status) => {
  const typeMap = {
    borrowed: 'warning',
    returning: 'info',
    returned: 'success',
    overdue: 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
