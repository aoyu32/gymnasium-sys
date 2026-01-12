<template>
  <div class="student-equipment">
    <div class="page-header">
      <h1>器材借还</h1>
      <p>在线借用体育器材，方便快捷</p>
    </div>

    <el-tabs v-model="activeTab">
      <!-- 器材列表 -->
      <el-tab-pane label="器材借用" name="borrow">
        <div class="filter-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索器材名称"
            :prefix-icon="Search"
            clearable
            style="width: 300px"
          />
          <el-select v-model="categoryFilter" placeholder="器材分类" clearable>
            <el-option label="球类" value="ball" />
            <el-option label="球拍" value="racket" />
            <el-option label="护具" value="protection" />
          </el-select>
        </div>

        <div class="equipment-grid">
          <div v-for="item in equipmentList" :key="item.id" class="equipment-card">
            <div class="equipment-image">
              <img :src="item.image" :alt="item.name" />
              <div v-if="item.stock === 0" class="stock-badge unavailable">已借完</div>
              <div v-else class="stock-badge available">可借</div>
            </div>
            <div class="equipment-info">
              <h3>{{ item.name }}</h3>
              <p class="equipment-desc">{{ item.description }}</p>
              <div class="equipment-meta">
                <span class="stock">库存: {{ item.stock }}/{{ item.total }}</span>
                <span class="condition" :class="item.condition">
                  {{ item.conditionText }}
                </span>
              </div>
              <el-button
                type="primary"
                :disabled="item.stock === 0"
                @click="handleBorrow(item)"
              >
                {{ item.stock === 0 ? '已借完' : '立即借用' }}
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 我的借用记录 -->
      <el-tab-pane label="借用记录" name="records">
        <el-table :data="borrowRecords" stripe>
          <el-table-column prop="equipmentName" label="器材名称" />
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column prop="borrowDate" label="借用日期" />
          <el-table-column prop="returnDate" label="应还日期" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button
                v-if="row.status === 'borrowed'"
                link
                type="primary"
                size="small"
                @click="handleReturn(row)"
              >
                归还
              </el-button>
              <el-button link type="primary" size="small">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 借用对话框 -->
    <el-dialog v-model="borrowDialogVisible" title="借用器材" width="500px">
      <el-form :model="borrowForm" label-width="100px">
        <el-form-item label="器材名称">
          <el-input v-model="currentEquipment.name" disabled />
        </el-form-item>
        <el-form-item label="借用数量">
          <el-input-number
            v-model="borrowForm.quantity"
            :min="1"
            :max="currentEquipment.stock"
          />
        </el-form-item>
        <el-form-item label="借用天数">
          <el-input-number v-model="borrowForm.days" :min="1" :max="7" />
        </el-form-item>
        <el-form-item label="借用理由">
          <el-input
            v-model="borrowForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请简要说明借用目的"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="borrowDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBorrow">确认借用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const activeTab = ref('borrow')
const searchKeyword = ref('')
const categoryFilter = ref('')
const borrowDialogVisible = ref(false)
const currentEquipment = ref({})

const borrowForm = ref({
  quantity: 1,
  days: 1,
  reason: ''
})

const equipmentList = ref([
  {
    id: 1,
    name: '篮球',
    description: '标准7号篮球，适合室内外使用',
    stock: 15,
    total: 20,
    condition: 'good',
    conditionText: '状态良好',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300'
  },
  {
    id: 2,
    name: '羽毛球拍',
    description: '碳纤维球拍，轻便耐用',
    stock: 8,
    total: 12,
    condition: 'good',
    conditionText: '状态良好',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300'
  },
  {
    id: 3,
    name: '乒乓球拍',
    description: '专业乒乓球拍套装',
    stock: 0,
    total: 10,
    condition: 'good',
    conditionText: '状态良好',
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=300'
  }
])

const borrowRecords = ref([
  {
    id: 1,
    equipmentName: '篮球',
    quantity: 2,
    borrowDate: '2026-01-10',
    returnDate: '2026-01-17',
    status: 'borrowed',
    statusText: '借用中'
  },
  {
    id: 2,
    equipmentName: '羽毛球拍',
    quantity: 1,
    borrowDate: '2026-01-05',
    returnDate: '2026-01-12',
    status: 'returned',
    statusText: '已归还'
  }
])

const handleBorrow = (item) => {
  currentEquipment.value = item
  borrowForm.value = { quantity: 1, days: 1, reason: '' }
  borrowDialogVisible.value = true
}

const confirmBorrow = () => {
  if (!borrowForm.value.reason) {
    ElMessage.warning('请填写借用理由')
    return
  }
  ElMessage.success('借用申请提交成功')
  borrowDialogVisible.value = false
}

const handleReturn = (row) => {
  ElMessageBox.confirm('确认归还该器材吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('归还成功')
  }).catch(() => {})
}

const getStatusType = (status) => {
  const typeMap = {
    borrowed: 'warning',
    returned: 'success',
    overdue: 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
