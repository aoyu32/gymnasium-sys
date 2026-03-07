<template>
  <div class="equipment-info-management">
    <el-card>
      <template #header>
        <div class="header">
          <span>器材信息管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加器材
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索器材名称"
          clearable
          style="width: 300px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCategory" placeholder="器材分类" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="球类" value="ball" />
          <el-option label="球拍" value="racket" />
          <el-option label="护具" value="protection" />
          <el-option label="其他" value="other" />
        </el-select>
      </div>

      <!-- 器材列表 -->
      <el-table :data="paginatedEquipments" stripe style="margin-top: 20px">
        <el-table-column prop="image" label="器材图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="器材名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="category" label="器材分类" width="100">
          <template #default="{ row }">
            {{ getCategoryLabel(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="brandsCount" label="品牌规格种数" width="120">
          <template #default="{ row }">
            {{ row.brands?.length || 0 }}种
          </template>
        </el-table-column>
        <el-table-column prop="total" label="总库存" width="100">
          <template #default="{ row }">
            {{ (row.stock || 0) + (row.scrapped || 0) }}件
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="正常使用" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.stock === 0 ? '#f56c6c' : row.stock < 5 ? '#e6a23c' : '#67c23a' }">
              {{ row.stock }}件
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="scrapped" label="已报废" width="100">
          <template #default="{ row }">
            <span style="color: #909399">{{ row.scrapped || 0 }}件</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="入库时间" width="110">
          <template #default="{ row }">
            {{ row.createdAt }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="360" fixed="right">
          <template #default="{ row }">
            <div style="display: flex; gap: 8px; flex-wrap: nowrap; white-space: nowrap;">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">查看详情</el-button>
              <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="info" size="small" @click="handleManageBrands(row)">品牌规格管理</el-button>
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
        :total="filteredEquipments.length"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="器材名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入器材名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="器材分类" prop="category">
              <el-select v-model="formData.category" placeholder="请选择器材分类" style="width: 100%">
                <el-option label="球类" value="ball" />
                <el-option label="球拍" value="racket" />
                <el-option label="护具" value="protection" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="总数量" prop="total">
          <el-input-number v-model="formData.total" :min="1" :max="1000" style="width: 100%" />
          <div class="form-tip">提示：器材状态由各品牌规格的状态自动计算</div>
        </el-form-item>
        <el-form-item label="器材图片" prop="image">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :http-request="handleImageUpload"
          >
            <img v-if="formData.image" :src="formData.image" class="uploaded-image" />
            <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：400x400，支持jpg、png格式</div>
        </el-form-item>
        <el-form-item label="器材描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入器材描述"
          />
        </el-form-item>
        <el-form-item label="使用须知" prop="notice">
          <el-input
            v-model="formData.notice"
            type="textarea"
            :rows="4"
            placeholder="请输入使用须知，每行一条，如：请爱护器材，使用后归还原位"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="器材详情"
      width="800px"
    >
      <div class="equipment-detail" v-if="currentEquipment">
        <!-- 器材图片 -->
        <div class="detail-section">
          <el-image
            :src="currentEquipment.image"
            fit="cover"
            style="width: 100%; height: 300px; border-radius: 8px"
            :preview-src-list="[currentEquipment.image]"
          />
        </div>

        <!-- 基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">器材名称：</span>
                <span class="value">{{ currentEquipment.name }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">器材分类：</span>
                <span class="value">{{ getCategoryLabel(currentEquipment.category) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">总库存：</span>
                <span class="value">{{ (currentEquipment.stock || 0) + (currentEquipment.scrapped || 0) }}件</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">正常使用数量：</span>
                <span class="value">{{ currentEquipment.stock }}件</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">已报废数量：</span>
                <span class="value">{{ currentEquipment.scrapped || 0 }}件</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">品牌规格种数：</span>
                <span class="value">{{ currentEquipment.brands?.length || 0 }}种</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">入库时间：</span>
                <span class="value">{{ currentEquipment.createdAt }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 品牌规格 -->
        <div class="detail-section" v-if="currentEquipment.brands && currentEquipment.brands.length > 0">
          <h3 class="section-title">品牌规格</h3>
          <el-table :data="currentEquipment.brands" stripe>
            <el-table-column prop="name" label="品牌" width="130" />
            <el-table-column prop="model" label="型号" width="130" />
            <el-table-column prop="total" label="总数" width="100">
              <template #default="{ row }">
                {{ (row.stock || 0) + (row.scrapped || 0) }}件
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="正常数量" width="100">
              <template #default="{ row }">
                <span :style="{ color: row.stock > 0 ? '#67c23a' : '#909399' }">{{ row.stock }}件</span>
              </template>
            </el-table-column>
            <el-table-column prop="scrapped" label="报废数量" width="100">
              <template #default="{ row }">
                <span style="color: #909399">{{ row.scrapped || 0 }}件</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 器材描述 -->
        <div class="detail-section" v-if="currentEquipment.description">
          <h3 class="section-title">器材描述</h3>
          <p class="description-text">{{ currentEquipment.description }}</p>
        </div>

        <!-- 使用须知 -->
        <div class="detail-section" v-if="currentEquipment.notice">
          <h3 class="section-title">使用须知</h3>
          <div class="notice-list">
            <div v-for="(item, index) in currentEquipment.notice.split('\n')" :key="index" class="notice-item">
              <span class="notice-dot">•</span>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 品牌规格管理对话框 -->
    <el-dialog
      v-model="brandDialogVisible"
      title="品牌规格管理"
      width="800px"
    >
      <div class="brand-management">
        <div class="brand-header">
          <span>{{ currentEquipment?.name }} - 品牌规格列表</span>
          <el-button type="primary" size="small" @click="handleAddBrand">
            <el-icon><Plus /></el-icon>
            添加品牌规格
          </el-button>
        </div>
        <el-table :data="currentEquipment?.brands || []" stripe style="margin-top: 16px">
          <el-table-column prop="name" label="品牌名称" min-width="120" />
          <el-table-column prop="model" label="型号" min-width="120" />
          <el-table-column prop="total" label="总数" width="80" align="center">
            <template #default="{ row }">
              {{ (row.stock || 0) + (row.scrapped || 0) }}件
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="正常数量" width="90" align="center">
            <template #default="{ row }">
              <span :style="{ color: row.stock > 0 ? '#67c23a' : '#909399' }">{{ row.stock }}件</span>
            </template>
          </el-table-column>
          <el-table-column prop="scrapped" label="报废数量" width="90" align="center">
            <template #default="{ row }">
              <span style="color: #909399">{{ row.scrapped || 0 }}件</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row, $index }">
              <div class="brand-actions">
                <el-button link type="primary" size="small" @click="handleEditBrand(row, $index)">编辑</el-button>
                <el-button link type="success" size="small" @click="handleRestockBrand(row, $index)">申请进货</el-button>
                <el-button link type="warning" size="small" @click="handleScrapBrand(row, $index)" :disabled="row.stock === 0">报废</el-button>
                <el-button link type="danger" size="small" @click="handleDeleteBrand($index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="brandDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑品牌规格对话框 -->
    <el-dialog
      v-model="brandFormVisible"
      :title="brandFormTitle"
      width="500px"
    >
      <el-form :model="brandFormData" :rules="brandRules" ref="brandFormRef" label-width="100px">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="brandFormData.name" placeholder="请输入品牌名称，如：斯伯丁" />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="brandFormData.model" placeholder="请输入型号，如：NBA官方用球" />
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input-number v-model="brandFormData.stock" :min="0" :max="1000" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="brandFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitBrand">确定</el-button>
      </template>
    </el-dialog>
    <!-- 报废对话框 -->
    <el-dialog
      v-model="scrapDialogVisible"
      title="报废器材"
      width="500px"
    >
      <el-form :model="scrapFormData" :rules="scrapRules" ref="scrapFormRef" label-width="120px">
        <el-form-item label="品牌规格">
          <el-input :value="`${scrapFormData.brandName} ${scrapFormData.brandModel}`" disabled />
        </el-form-item>
        <el-form-item label="当前正常数量">
          <el-input :value="`${scrapFormData.currentStock}件`" disabled />
        </el-form-item>
        <el-form-item label="报废数量" prop="scrapCount">
          <el-input-number 
            v-model="scrapFormData.scrapCount" 
            :min="1" 
            :max="scrapFormData.currentStock" 
            style="width: 100%" 
          />
          <div class="form-tip">最多可报废{{ scrapFormData.currentStock }}件</div>
        </el-form-item>
        <el-form-item label="报废原因" prop="reason">
          <el-input
            v-model="scrapFormData.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入报废原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scrapDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleSubmitScrap">确认报废</el-button>
      </template>
    </el-dialog>

    <!-- 申请进货对话框 -->
    <el-dialog
      v-model="restockDialogVisible"
      title="申请进货"
      width="500px"
    >
      <el-form :model="restockFormData" :rules="restockRules" ref="restockFormRef" label-width="120px">
        <el-form-item label="品牌规格">
          <el-input :value="`${restockFormData.brandName} ${restockFormData.brandModel}`" disabled />
        </el-form-item>
        <el-form-item label="当前正常数量">
          <el-input :value="`${restockFormData.currentStock}件`" disabled />
        </el-form-item>
        <el-form-item label="申请进货数量" prop="restockCount">
          <el-input-number 
            v-model="restockFormData.restockCount" 
            :min="1" 
            :max="1000" 
            style="width: 100%" 
          />
        </el-form-item>
        <el-form-item label="申请理由" prop="reason">
          <el-input
            v-model="restockFormData.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入申请进货的理由"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="restockDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitRestock">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import {
  getEquipmentPage,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  addBrand,
  updateBrand,
  deleteBrand,
  scrapBrand
} from '@/api/equipment'
import { uploadImage } from '@/api/file'
import { submitPurchase } from '@/api/equipment-purchase'

const searchKeyword = ref('')
const filterCategory = ref('')
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('添加器材')
const formRef = ref(null)
const editingId = ref(null)
const currentEquipment = ref(null)
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 品牌规格管理相关
const brandDialogVisible = ref(false)
const brandFormVisible = ref(false)
const brandFormTitle = ref('添加品牌规格')
const brandFormRef = ref(null)
const editingBrandIndex = ref(null)

// 报废相关
const scrapDialogVisible = ref(false)
const scrapFormRef = ref(null)
const scrapBrandIndex = ref(null)

// 申请进货相关
const restockDialogVisible = ref(false)
const restockFormRef = ref(null)
const restockBrandIndex = ref(null)

const formData = ref({
  name: '',
  category: '',
  total: 10,
  image: '',
  description: '',
  notice: ''
})

const brandFormData = ref({
  name: '',
  model: '',
  stock: 0
})

const scrapFormData = ref({
  brandName: '',
  brandModel: '',
  currentStock: 0,
  scrapCount: 1,
  reason: ''
})

const restockFormData = ref({
  brandName: '',
  brandModel: '',
  currentStock: 0,
  restockCount: 1,
  reason: ''
})

const rules = {
  name: [{ required: true, message: '请输入器材名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择器材分类', trigger: 'change' }],
  total: [{ required: true, message: '请输入总数量', trigger: 'blur' }],
  image: [{ required: true, message: '请上传器材图片', trigger: 'change' }]
}

const brandRules = {
  name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
  model: [{ required: true, message: '请输入型号', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }]
}

const scrapRules = {
  scrapCount: [{ required: true, message: '请输入报废数量', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入报废原因', trigger: 'blur' }]
}

const restockRules = {
  restockCount: [{ required: true, message: '请输入进货数量', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入申请理由', trigger: 'blur' }]
}

const equipmentsList = ref([])

// 加载器材列表
const loadEquipments = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: 1,
      pageSize: 1000,
      keyword: searchKeyword.value,
      category: filterCategory.value
    }
    const res = await getEquipmentPage(params)
    equipmentsList.value = res.data.records || []
  } catch (error) {
    console.error('加载器材列表失败:', error)
    ElMessage.error('加载器材列表失败')
  } finally {
    loading.value = false
  }
}

// 监听搜索条件变化
watch([searchKeyword, filterCategory], () => {
  loadEquipments()
})

onMounted(() => {
  loadEquipments()
})

const filteredEquipments = computed(() => {
  return equipmentsList.value
})

// 分页后的数据
const paginatedEquipments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredEquipments.value.slice(start, end)
})

const categoryMap = {
  ball: '球类',
  racket: '球拍',
  protection: '护具',
  other: '其他'
}

const getCategoryLabel = (category) => {
  return categoryMap[category] || '其他'
}

const getConditionType = (condition) => {
  const typeMap = {
    good: 'success',
    maintenance: 'warning',
    scrapped: 'danger'
  }
  return typeMap[condition] || 'info'
}

const handleAdd = () => {
  dialogTitle.value = '添加器材'
  editingId.value = null
  formData.value = {
    name: '',
    category: '',
    total: 10,
    image: '',
    description: '',
    notice: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑器材'
  editingId.value = row.id
  formData.value = { ...row }
  dialogVisible.value = true
}

// 计算器材总库存（根据品牌规格库存自动计算）
const calculateEquipmentStock = (equipment) => {
  if (!equipment.brands || equipment.brands.length === 0) {
    return 0
  }
  return equipment.brands.reduce((sum, brand) => sum + brand.stock, 0)
}

// 计算器材报废总数（根据品牌规格报废数自动计算）
const calculateEquipmentScrapped = (equipment) => {
  if (!equipment.brands || equipment.brands.length === 0) {
    return 0
  }
  return equipment.brands.reduce((sum, brand) => sum + (brand.scrapped || 0), 0)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        if (editingId.value) {
          // 编辑器材
          await updateEquipment(editingId.value, formData.value)
          ElMessage.success('器材信息更新成功')
        } else {
          // 添加器材
          await createEquipment(formData.value)
          ElMessage.success('器材添加成功')
        }
        dialogVisible.value = false
        await loadEquipments()
      } catch (error) {
        console.error('保存器材失败:', error)
        ElMessage.error(error.message || '保存器材失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const getConditionText = (condition) => {
  const textMap = {
    good: '状态良好',
    maintenance: '需要维护',
    scrapped: '已报废'
  }
  return textMap[condition] || '状态良好'
}

const handleViewDetail = (row) => {
  currentEquipment.value = row
  detailVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该器材吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      await deleteEquipment(row.id)
      ElMessage.success('器材删除成功')
      await loadEquipments()
    } catch (error) {
      console.error('删除器材失败:', error)
      ElMessage.error(error.message || '删除器材失败')
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

// 图片上传前的校验
const beforeImageUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 自定义图片上传
const handleImageUpload = async (options) => {
  const { file } = options
  try {
    // 调用后端文件上传接口
    const res = await uploadImage(file, 'equipment')
    formData.value.image = res.data
    ElMessage.success('图片上传成功')
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error(error.message || '图片上传失败')
  }
}

// 品牌规格管理相关方法
const handleManageBrands = (row) => {
  currentEquipment.value = row
  brandDialogVisible.value = true
}

const handleAddBrand = () => {
  brandFormTitle.value = '添加品牌规格'
  editingBrandIndex.value = null
  brandFormData.value = {
    name: '',
    model: '',
    stock: 0
  }
  brandFormVisible.value = true
}

const handleEditBrand = (row, index) => {
  brandFormTitle.value = '编辑品牌规格'
  editingBrandIndex.value = index
  brandFormData.value = { ...row }
  brandFormVisible.value = true
}

const handleSubmitBrand = async () => {
  if (!brandFormRef.value) return
  
  await brandFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const equipmentId = currentEquipment.value.id
        
        if (editingBrandIndex.value !== null) {
          // 编辑品牌规格
          const brandId = currentEquipment.value.brands[editingBrandIndex.value].id
          await updateBrand(equipmentId, brandId, brandFormData.value)
          ElMessage.success('品牌规格更新成功')
        } else {
          // 添加品牌规格
          await addBrand(equipmentId, brandFormData.value)
          ElMessage.success('品牌规格添加成功')
        }
        
        brandFormVisible.value = false
        // 重新加载器材列表以获取最新数据
        await loadEquipments()
        // 更新当前器材数据
        const updatedEquipment = equipmentsList.value.find(e => e.id === equipmentId)
        if (updatedEquipment) {
          currentEquipment.value = updatedEquipment
        }
      } catch (error) {
        console.error('保存品牌规格失败:', error)
        ElMessage.error(error.message || '保存品牌规格失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 报废品牌规格
const handleScrapBrand = (row, index) => {
  scrapBrandIndex.value = index
  scrapFormData.value = {
    brandName: row.name,
    brandModel: row.model,
    currentStock: row.stock,
    scrapCount: 1,
    reason: ''
  }
  scrapDialogVisible.value = true
}

const handleSubmitScrap = async () => {
  if (!scrapFormRef.value) return
  
  await scrapFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const equipmentId = currentEquipment.value.id
        const brand = currentEquipment.value.brands[scrapBrandIndex.value]
        const brandId = brand.id
        
        const scrapData = {
          count: scrapFormData.value.scrapCount,
          reason: scrapFormData.value.reason
        }
        
        await scrapBrand(equipmentId, brandId, scrapData)
        ElMessage.success(`已报废${scrapFormData.value.scrapCount}件器材`)
        scrapDialogVisible.value = false
        
        // 重新加载器材列表以获取最新数据
        await loadEquipments()
        // 更新当前器材数据
        const updatedEquipment = equipmentsList.value.find(e => e.id === equipmentId)
        if (updatedEquipment) {
          currentEquipment.value = updatedEquipment
        }
      } catch (error) {
        console.error('报废器材失败:', error)
        ElMessage.error(error.message || '报废器材失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 申请进货
const handleRestockBrand = (row, index) => {
  restockBrandIndex.value = index
  restockFormData.value = {
    brandName: row.name,
    brandModel: row.model,
    currentStock: row.stock,
    restockCount: 1,
    reason: ''
  }
  restockDialogVisible.value = true
}

const handleSubmitRestock = async () => {
  if (!restockFormRef.value) return
  
  await restockFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        // 提交进货申请，等待系统管理员审批
        const brand = currentEquipment.value.brands[restockBrandIndex.value]
        
        const purchaseData = {
          equipmentName: currentEquipment.value.name,
          categoryId: currentEquipment.value.categoryId,
          brandName: brand.name,
          model: brand.model,
          quantity: restockFormData.value.restockCount,
          reason: restockFormData.value.reason
        }
        
        await submitPurchase(purchaseData)
        ElMessage.success('进货申请已提交，等待系统管理员审批')
        restockDialogVisible.value = false
      } catch (error) {
        console.error('提交进货申请失败:', error)
        ElMessage.error(error.message || '提交进货申请失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleDeleteBrand = (index) => {
  ElMessageBox.confirm(
    '确定要删除该品牌规格吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      const equipmentId = currentEquipment.value.id
      const brandId = currentEquipment.value.brands[index].id
      
      await deleteBrand(equipmentId, brandId)
      ElMessage.success('品牌规格删除成功')
      
      // 重新加载器材列表以获取最新数据
      await loadEquipments()
      // 更新当前器材数据
      const updatedEquipment = equipmentsList.value.find(e => e.id === equipmentId)
      if (updatedEquipment) {
        currentEquipment.value = updatedEquipment
      }
    } catch (error) {
      console.error('删除品牌规格失败:', error)
      ElMessage.error(error.message || '删除品牌规格失败')
    } finally {
      loading.value = false
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
@use './styles/info.scss';
</style>
