<template>
  <div class="equipment-return-management">
    <el-card>
      <template #header>
        <div class="header">
          <span>器材归还管理</span>
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
        <el-select v-model="filterStatus" placeholder="归还状态" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="待审核" value="returning" />
          <el-option label="已归还" value="returned" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
        <el-date-picker
          v-model="filterDate"
          type="date"
          placeholder="选择日期"
          clearable
          style="width: 200px; margin-left: 12px"
        />
      </div>

      <!-- 归还列表 -->
      <el-table :data="paginatedReturns" stripe style="margin-top: 20px">
        <el-table-column prop="borrower" label="借用人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="studentId" label="学号/工号" width="120" />
        <el-table-column prop="equipmentName" label="器材名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="brandInfo" label="品牌规格" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.brandName }} {{ row.brandModel }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="归还数量" width="100">
          <template #default="{ row }">
            {{ row.quantity }}件
          </template>
        </el-table-column>
        <el-table-column prop="condition" label="器材状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getConditionType(row.condition)" size="small">
              {{ getConditionText(row.condition) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="returnTime" label="归还时间" width="160" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div style="display: flex; gap: 8px; flex-wrap: nowrap; white-space: nowrap;">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
              <template v-if="row.status === 'returning'">
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
        :total="filteredReturns.length"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="归还申请详情"
      width="800px"
    >
      <div class="return-detail" v-if="currentReturn">
        <!-- 借用人信息 -->
        <div class="detail-section">
          <h3 class="section-title">借用人信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">借用人姓名：</span>
                <span class="value">{{ currentReturn.borrower }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">联系电话：</span>
                <span class="value">{{ currentReturn.phone }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">学号/工号：</span>
                <span class="value">{{ currentReturn.studentId }}</span>
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
                <span class="value">{{ currentReturn.equipmentName }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">品牌规格：</span>
                <span class="value">{{ currentReturn.brandName }} {{ currentReturn.brandModel }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">归还数量：</span>
                <span class="value">{{ currentReturn.quantity }}件</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">器材状态：</span>
                <el-tag :type="getConditionType(currentReturn.condition)" size="small">
                  {{ getConditionText(currentReturn.condition) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">借用日期：</span>
                <span class="value">{{ currentReturn.borrowDate }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">预计归还日期：</span>
                <span class="value">{{ currentReturn.expectedReturnDate }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 归还信息 -->
        <div class="detail-section">
          <h3 class="section-title">归还信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">审核状态：</span>
                <el-tag :type="getStatusType(currentReturn.status)" size="small">
                  {{ getStatusText(currentReturn.status) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">归还时间：</span>
                <span class="value">{{ currentReturn.returnTime }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 器材照片 -->
        <div class="detail-section" v-if="currentReturn.images && currentReturn.images.length > 0">
          <h3 class="section-title">器材照片</h3>
          <div class="image-gallery">
            <el-image
              v-for="(img, index) in currentReturn.images"
              :key="index"
              :src="img"
              fit="cover"
              class="gallery-image"
              :preview-src-list="currentReturn.images"
              :initial-index="index"
            />
          </div>
        </div>

        <!-- 备注说明 -->
        <div class="detail-section" v-if="currentReturn.remark">
          <h3 class="section-title">备注说明</h3>
          <p class="description-text">{{ currentReturn.remark }}</p>
        </div>

        <!-- 拒绝原因 -->
        <div class="detail-section" v-if="currentReturn.rejectReason">
          <h3 class="section-title">拒绝原因</h3>
          <p class="description-text">{{ currentReturn.rejectReason }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <template v-if="currentReturn && currentReturn.status === 'returning'">
          <el-button type="success" @click="handleApprove(currentReturn)">通过审核</el-button>
          <el-button type="danger" @click="handleReject(currentReturn)">拒绝归还</el-button>
        </template>
      </template>
    </el-dialog>

    <!-- 拒绝原因对话框 -->
    <el-dialog
      v-model="rejectVisible"
      title="拒绝归还"
      width="500px"
    >
      <el-form :model="rejectForm" :rules="rejectRules" ref="rejectFormRef" label-width="80px">
        <el-form-item label="拒绝原因" prop="reason">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因，如：器材损坏严重需要赔偿"
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
const filterDate = ref('')
const detailVisible = ref(false)
const rejectVisible = ref(false)
const currentReturn = ref(null)
const rejectingReturn = ref(null)
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

const returns = ref([
  {
    id: 1,
    borrower: '张三',
    phone: '13800138001',
    studentId: '2021001',
    equipmentName: '篮球',
    brandName: '斯伯丁',
    brandModel: 'NBA官方用球',
    quantity: 2,
    condition: 'good',
    borrowDate: '2026-02-25',
    expectedReturnDate: '2026-02-28',
    returnTime: '2026-03-01 14:30',
    status: 'returning',
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=400'
    ],
    remark: '器材完好无损，已清洁'
  },
  {
    id: 2,
    borrower: '李四',
    phone: '13800138002',
    studentId: '2021002',
    equipmentName: '羽毛球拍',
    brandName: '尤尼克斯',
    brandModel: 'NANORAY系列',
    quantity: 2,
    condition: 'normal',
    borrowDate: '2026-02-20',
    expectedReturnDate: '2026-02-27',
    returnTime: '2026-02-27 16:00',
    status: 'returned',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400'
    ],
    remark: '球拍有轻微磨损，但不影响使用'
  },
  {
    id: 3,
    borrower: '王五',
    phone: '13800138003',
    studentId: '2021003',
    equipmentName: '足球',
    brandName: '阿迪达斯',
    brandModel: '世界杯用球',
    quantity: 1,
    condition: 'damaged',
    borrowDate: '2026-02-22',
    expectedReturnDate: '2026-02-27',
    returnTime: '2026-02-28 10:00',
    status: 'rejected',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400'
    ],
    remark: '足球表面有破损',
    rejectReason: '器材损坏严重，需要赔偿后才能完成归还'
  },
  {
    id: 4,
    borrower: '赵六',
    phone: '13800138004',
    studentId: '2021004',
    equipmentName: '护膝',
    brandName: 'LP',
    brandModel: '专业护膝',
    quantity: 2,
    condition: 'good',
    borrowDate: '2026-02-23',
    expectedReturnDate: '2026-03-02',
    returnTime: '2026-03-01 15:20',
    status: 'returning',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'
    ],
    remark: '器材完好，已清洗干净'
  }
])

const filteredReturns = computed(() => {
  return returns.value.filter(ret => {
    const matchKeyword = !searchKeyword.value || 
      ret.borrower.includes(searchKeyword.value) || 
      ret.equipmentName.includes(searchKeyword.value)
    const matchStatus = !filterStatus.value || ret.status === filterStatus.value
    const matchDate = !filterDate.value || ret.returnTime.startsWith(formatDate(filterDate.value))
    return matchKeyword && matchStatus && matchDate
  })
})

// 分页后的数据
const paginatedReturns = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredReturns.value.slice(start, end)
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getConditionType = (condition) => {
  const typeMap = {
    good: 'success',
    normal: 'warning',
    damaged: 'danger'
  }
  return typeMap[condition] || 'info'
}

const getConditionText = (condition) => {
  const textMap = {
    good: '完好无损',
    normal: '轻微磨损',
    damaged: '有损坏'
  }
  return textMap[condition] || condition
}

const getStatusType = (status) => {
  const typeMap = {
    returning: 'warning',
    returned: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    returning: '待审核',
    returned: '已归还',
    rejected: '已拒绝'
  }
  return textMap[status] || status
}

const handleApprove = (row) => {
  ElMessageBox.confirm(
    `确定通过"${row.borrower}"的归还申请吗？`,
    '确认通过',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    row.status = 'returned'
    ElMessage.success('归还审核已通过')
    detailVisible.value = false
  }).catch(() => {})
}

const handleReject = (row) => {
  rejectingReturn.value = row
  rejectForm.value.reason = ''
  rejectVisible.value = true
}

const confirmReject = async () => {
  if (!rejectFormRef.value) return
  
  await rejectFormRef.value.validate((valid) => {
    if (valid) {
      rejectingReturn.value.status = 'rejected'
      rejectingReturn.value.rejectReason = rejectForm.value.reason
      rejectVisible.value = false
      detailVisible.value = false
      ElMessage.success('归还申请已拒绝')
    }
  })
}

const handleViewDetail = (row) => {
  currentReturn.value = row
  detailVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该归还记录吗？删除后将无法恢复。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = returns.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      returns.value.splice(index, 1)
      ElMessage.success('记录删除成功')
      if (currentReturn.value?.id === row.id) {
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
@use './styles/return.scss';
</style>
