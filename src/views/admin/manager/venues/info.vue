<template>
  <div class="venue-info-management">
    <el-card>
      <template #header>
        <div class="header">
          <span>场地信息管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加场地
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索场地名称"
          clearable
          style="width: 300px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCategory" placeholder="场地分类" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="篮球" value="basketball" />
          <el-option label="足球" value="football" />
          <el-option label="羽毛球" value="badminton" />
          <el-option label="乒乓球" value="tabletennis" />
          <el-option label="网球" value="tennis" />
          <el-option label="排球" value="volleyball" />
          <el-option label="游泳" value="swimming" />
          <el-option label="健身" value="fitness" />
          <el-option label="跑步" value="running" />
          <el-option label="武术" value="martialarts" />
          <el-option label="其他" value="other" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="场地状态" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="正常使用" value="available" />
          <el-option label="部分维护" value="partial_maintenance" />
          <el-option label="维护中" value="maintenance" />
        </el-select>
      </div>

      <!-- 场地列表 -->
      <el-table :data="paginatedVenues" stripe style="margin-top: 20px" v-loading="loading">
        <el-table-column prop="image" label="场地图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="场地名称" width="150" />
        <el-table-column prop="category" label="场地分类" width="100">
          <template #default="{ row }">
            {{ getCategoryLabel(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="capacity" label="容纳人数" width="100" />
        <el-table-column prop="areas" label="区域数量" width="100">
          <template #default="{ row }">
            {{ row.areas?.length || 0 }}个区域
          </template>
        </el-table-column>
        <el-table-column prop="availableAreas" label="可申请区域" width="120">
          <template #default="{ row }">
            <el-tag :type="getAvailableAreasType(row)" size="small">
              {{ getAvailableAreasCount(row) }}个可用
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="300" show-overflow-tooltip />
        <el-table-column label="操作" width="320" fixed="right">
          <template #default="{ row }">
            <div style="display: flex; gap: 8px; flex-wrap: nowrap; white-space: nowrap;">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">查看详情</el-button>
              <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="info" size="small" @click="handleManageAreas(row)">区域管理</el-button>
              <el-button link type="warning" size="small" @click="handleToggleStatus(row)">
                {{ row.status === 'maintenance' ? '恢复' : '维护' }}
              </el-button>
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="场地名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入场地名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场地分类" prop="category">
              <el-select v-model="formData.category" placeholder="请选择场地分类" style="width: 100%">
                <el-option label="篮球" value="basketball" />
                <el-option label="足球" value="football" />
                <el-option label="羽毛球" value="badminton" />
                <el-option label="乒乓球" value="tabletennis" />
                <el-option label="网球" value="tennis" />
                <el-option label="排球" value="volleyball" />
                <el-option label="游泳" value="swimming" />
                <el-option label="健身" value="fitness" />
                <el-option label="跑步" value="running" />
                <el-option label="武术" value="martialarts" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="容纳人数" prop="capacity">
          <el-input-number v-model="formData.capacity" :min="1" :max="1000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="场地图片" prop="images">
          <el-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePicturePreview"
            :on-remove="handleRemove"
            :on-change="handleImageChange"
            accept="image/*"
            multiple
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">支持上传多张图片，建议尺寸800x600，单张不超过2MB</div>
        </el-form-item>
        <el-form-item label="场地状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="available">正常使用</el-radio>
            <el-radio label="partial_maintenance">部分维护</el-radio>
            <el-radio label="maintenance">维护中</el-radio>
          </el-radio-group>
          <div class="status-tip">提示：如果场地有区域，状态会根据区域维护情况自动计算</div>
        </el-form-item>
        <el-form-item label="场地描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入场地描述"
          />
        </el-form-item>
        <el-form-item label="使用须知" prop="notice">
          <el-input
            v-model="formData.notice"
            type="textarea"
            :rows="4"
            placeholder="请输入使用须知，每行一条，如：请提前预约，按时到达场地"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewDialogVisible" title="图片预览" width="800px">
      <img :src="previewImageUrl" style="width: 100%" alt="预览图片" />
    </el-dialog>

    <!-- 场地详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="场地详情"
      width="900px"
    >
      <div class="venue-detail" v-if="detailVenue">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">场地名称：</span>
                <span class="value">{{ detailVenue.name }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">场地分类：</span>
                <span class="value">{{ getCategoryLabel(detailVenue.category) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">容纳人数：</span>
                <span class="value">{{ detailVenue.capacity }}人</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">场地状态：</span>
                <el-tag :type="getStatusType(detailVenue.status)" size="small">
                  {{ getStatusText(detailVenue.status) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">区域数量：</span>
                <span class="value">{{ detailVenue.areas?.length || 0 }}个</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">可申请区域：</span>
                <el-tag :type="getAvailableAreasType(detailVenue)" size="small">
                  {{ getAvailableAreasCount(detailVenue) }}个可用
                </el-tag>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 场地图片 -->
        <div class="detail-section" v-if="detailVenue.images && detailVenue.images.length > 0">
          <h3 class="section-title">场地图片</h3>
          <div class="image-gallery">
            <el-image
              v-for="(img, index) in detailVenue.images"
              :key="index"
              :src="img"
              fit="cover"
              class="gallery-image"
              :preview-src-list="detailVenue.images"
              :initial-index="index"
            />
          </div>
        </div>

        <!-- 场地描述 -->
        <div class="detail-section" v-if="detailVenue.description">
          <h3 class="section-title">场地描述</h3>
          <p class="description-text">{{ detailVenue.description }}</p>
        </div>

        <!-- 使用须知 -->
        <div class="detail-section" v-if="detailVenue.notice">
          <h3 class="section-title">使用须知</h3>
          <div class="notice-list">
            <div v-for="(item, index) in detailVenue.notice.split('\n')" :key="index" class="notice-item">
              <span class="notice-dot">•</span>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- 区域信息 -->
        <div class="detail-section" v-if="detailVenue.areas && detailVenue.areas.length > 0">
          <h3 class="section-title">区域信息</h3>
          <el-table :data="detailVenue.areas" stripe border>
            <el-table-column prop="name" label="区域名称" width="200" />
            <el-table-column prop="capacity" label="容纳人数" width="120">
              <template #default="{ row }">
                {{ row.capacity }}人
              </template>
            </el-table-column>
            <el-table-column prop="inUse" label="使用状态" width="120">
              <template #default="{ row }">
                <el-tag :type="row.inUse ? 'danger' : 'success'" size="small">
                  {{ row.inUse ? '使用中' : '可申请' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="maintenance" label="维护状态" width="120">
              <template #default="{ row }">
                <el-tag :type="row.maintenance ? 'warning' : 'info'" size="small">
                  {{ row.maintenance ? '维护中' : '正常' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="综合状态">
              <template #default="{ row }">
                <el-tag v-if="row.maintenance" type="warning" size="small">维护中</el-tag>
                <el-tag v-else-if="row.inUse" type="danger" size="small">使用中</el-tag>
                <el-tag v-else type="success" size="small">可申请</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 区域管理对话框 -->
    <el-dialog
      v-model="areaDialogVisible"
      title="区域管理"
      width="900px"
    >
      <div class="area-management">
        <div class="area-header">
          <span>{{ currentVenue?.name }} - 区域列表</span>
          <el-button type="primary" size="small" @click="handleAddArea">
            <el-icon><Plus /></el-icon>
            添加区域
          </el-button>
        </div>
        <el-table :data="currentVenue?.areas || []" stripe style="margin-top: 16px">
          <el-table-column prop="name" label="区域名称" width="150" />
          <el-table-column prop="capacity" label="容纳人数" width="110" />
          <el-table-column prop="inUse" label="使用状态" width="110">
            <template #default="{ row }">
              <el-tag :type="row.inUse ? 'danger' : 'success'" size="small">
                {{ row.inUse ? '使用中' : '可申请' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="maintenance" label="维护状态" width="110">
            <template #default="{ row }">
              <el-tag :type="row.maintenance ? 'warning' : 'info'" size="small">
                {{ row.maintenance ? '维护中' : '正常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row, $index }">
              <div class="area-actions">
                <el-button link type="primary" size="small" @click="handleEditArea(row, $index)">编辑</el-button>
                <el-button link type="warning" size="small" @click="handleToggleAreaStatus(row)">
                  {{ row.inUse ? '设为可用' : '设为使用中' }}
                </el-button>
                <el-button link type="info" size="small" @click="handleToggleAreaMaintenance(row)">
                  {{ row.maintenance ? '结束维护' : '开始维护' }}
                </el-button>
                <el-button link type="danger" size="small" @click="handleDeleteArea($index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="areaDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑区域对话框 -->
    <el-dialog
      v-model="areaFormVisible"
      :title="areaFormTitle"
      width="500px"
    >
      <el-form :model="areaFormData" :rules="areaRules" ref="areaFormRef" label-width="100px">
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="areaFormData.name" placeholder="请输入区域名称，如：A1场地" />
        </el-form-item>
        <el-form-item label="容纳人数" prop="capacity">
          <el-input-number v-model="areaFormData.capacity" :min="1" :max="1000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="使用状态" prop="inUse">
          <el-radio-group v-model="areaFormData.inUse">
            <el-radio :label="false">可申请</el-radio>
            <el-radio :label="true">使用中</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="维护状态" prop="maintenance">
          <el-radio-group v-model="areaFormData.maintenance">
            <el-radio :label="false">正常</el-radio>
            <el-radio :label="true">维护中</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="areaFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitArea">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { getVenuePage, getVenueById, addVenue, updateVenue, deleteVenue, addVenueArea, updateVenueArea, deleteVenueArea, toggleAreaStatus, toggleAreaMaintenance } from '@/api/venue'
import { uploadImage } from '@/api/file'

const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('添加场地')
const formRef = ref(null)
const editingId = ref(null)
const fileList = ref([])
const previewDialogVisible = ref(false)
const previewImageUrl = ref('')
const detailDialogVisible = ref(false)
const detailVenue = ref(null)
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 区域管理相关
const areaDialogVisible = ref(false)
const areaFormVisible = ref(false)
const areaFormTitle = ref('添加区域')
const areaFormRef = ref(null)
const currentVenue = ref(null)
const editingAreaIndex = ref(null)

const formData = ref({
  name: '',
  category: '',
  capacity: 50,
  images: [],
  status: 'available',
  description: '',
  notice: '',
  areas: []
})

const areaFormData = ref({
  name: '',
  capacity: 10,
  inUse: false,
  maintenance: false
})

const rules = {
  name: [{ required: true, message: '请输入场地名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择场地分类', trigger: 'change' }],
  capacity: [{ required: true, message: '请输入容纳人数', trigger: 'blur' }]
}

const areaRules = {
  name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入容纳人数', trigger: 'blur' }]
}

// 场地列表数据
const venues = ref([])

// 加载场地列表
const loadVenues = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      name: searchKeyword.value || undefined,
      category: filterCategory.value || undefined,
      status: filterStatus.value || undefined
    }
    const res = await getVenuePage(params)
    console.log('场地列表数据:', res.data.records)
    venues.value = res.data.records.map(venue => ({
      ...venue,
      // 解析images JSON字符串
      image: venue.images ? JSON.parse(venue.images)[0] : '',
      images: venue.images ? JSON.parse(venue.images) : [],
      // 确保areas字段存在
      areas: venue.areas || []
    }))
    console.log('处理后的场地数据:', venues.value)
    total.value = res.data.total
  } catch (error) {
    console.error('加载场地列表失败:', error)
    ElMessage.error('加载场地列表失败')
  } finally {
    loading.value = false
  }
}

// 初始化加载
onMounted(() => {
  loadVenues()
})

// 监听搜索和筛选条件变化
watch([searchKeyword, filterCategory, filterStatus], () => {
  currentPage.value = 1
  loadVenues()
})

// 计算场地状态（根据区域维护情况自动判断）
const calculateVenueStatus = (venue) => {
  if (!venue.areas || venue.areas.length === 0) {
    return venue.status
  }
  
  const maintenanceAreas = venue.areas.filter(area => area.maintenance)
  
  if (maintenanceAreas.length === 0) {
    return 'available'
  } else if (maintenanceAreas.length === venue.areas.length) {
    return 'maintenance'
  } else {
    return 'partial_maintenance'
  }
}

// 直接返回后端分页数据
const filteredVenues = computed(() => {
  return venues.value
})

// 直接返回后端分页数据
const paginatedVenues = computed(() => {
  return venues.value
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

const getStatusType = (status) => {
  const typeMap = {
    available: 'success',
    partial_maintenance: 'warning',
    maintenance: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    available: '正常使用',
    partial_maintenance: '部分维护',
    maintenance: '维护中'
  }
  return textMap[status] || status
}

// 获取可申请区域数量（排除维护中的区域）
const getAvailableAreasCount = (venue) => {
  if (!venue.areas || venue.areas.length === 0) {
    return venue.status === 'available' ? 1 : 0
  }
  return venue.areas.filter(area => !area.inUse && !area.maintenance).length
}

// 根据可申请区域数量返回标签类型
const getAvailableAreasType = (venue) => {
  const totalAreas = venue.areas?.length || 1
  const availableCount = getAvailableAreasCount(venue)
  const ratio = availableCount / totalAreas
  
  if (availableCount === 0) {
    return 'danger' // 红色：无可用区域
  } else if (ratio <= 0.3) {
    return 'warning' // 橙色：可用区域紧张（≤30%）
  } else if (ratio <= 0.6) {
    return 'primary' // 蓝色：可用区域一般（≤60%）
  } else {
    return 'success' // 绿色：可用区域充足（>60%）
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加场地'
  editingId.value = null
  formData.value = {
    name: '',
    category: '',
    capacity: 50,
    images: [],
    status: 'available',
    description: '',
    notice: '',
    areas: []
  }
  fileList.value = []
  dialogVisible.value = true
}

const handleViewDetail = async (row) => {
  try {
    loading.value = true
    // 从后端获取完整的场地信息（包含区域）
    const res = await getVenueById(row.id)
    const venue = res.data
    
    // 解析images
    detailVenue.value = {
      ...venue,
      images: venue.images ? JSON.parse(venue.images) : []
    }
    
    detailDialogVisible.value = true
  } catch (error) {
    console.error('加载场地详情失败:', error)
    ElMessage.error('加载场地详情失败')
  } finally {
    loading.value = false
  }
}

const handleEdit = async (row) => {
  dialogTitle.value = '编辑场地'
  editingId.value = row.id
  
  try {
    loading.value = true
    // 从后端获取完整的场地信息（包含区域）
    const res = await getVenueById(row.id)
    const venue = res.data
    
    // 解析images
    const images = venue.images ? JSON.parse(venue.images) : []
    
    formData.value = {
      ...venue,
      images: images,
      areas: venue.areas || []
    }
    
    // 将已有图片转换为fileList格式
    fileList.value = images.map((url, index) => ({
      name: `image-${index + 1}.jpg`,
      url: url,
      uid: Date.now() + index
    }))
    
    dialogVisible.value = true
  } catch (error) {
    console.error('加载场地详情失败:', error)
    ElMessage.error('加载场地详情失败')
  } finally {
    loading.value = false
  }
}

// 图片上传相关处理
const handleImageChange = async (file, uploadFiles) => {
  // 检查文件大小
  if (file.raw && file.raw.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过2MB')
    const index = uploadFiles.findIndex(f => f.uid === file.uid)
    if (index > -1) {
      uploadFiles.splice(index, 1)
    }
    return
  }
  
  // 上传图片到OSS
  if (file.raw) {
    try {
      const res = await uploadImage(file.raw, 'venue')
      const imageUrl = res.data
      
      if (!formData.value.images) {
        formData.value.images = []
      }
      
      // 找到对应的文件索引
      const fileIndex = fileList.value.findIndex(f => f.uid === file.uid)
      if (fileIndex > -1) {
        // 更新或添加图片URL
        if (formData.value.images[fileIndex]) {
          formData.value.images[fileIndex] = imageUrl
        } else {
          formData.value.images.push(imageUrl)
        }
      }
      
      ElMessage.success('图片上传成功')
    } catch (error) {
      console.error('图片上传失败:', error)
      ElMessage.error(error.message || '图片上传失败')
      // 上传失败，从列表中移除
      const index = uploadFiles.findIndex(f => f.uid === file.uid)
      if (index > -1) {
        uploadFiles.splice(index, 1)
      }
    }
  }
}

const handleRemove = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1 && formData.value.images) {
    formData.value.images.splice(index, 1)
  }
}

const handlePicturePreview = (file) => {
  previewImageUrl.value = file.url
  previewDialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      // 确保至少有一张图片
      if (!formData.value.images || formData.value.images.length === 0) {
        ElMessage.warning('请至少上传一张场地图片')
        return
      }
      
      try {
        loading.value = true
        // 将images数组转为JSON字符串
        const venueData = {
          ...formData.value,
          images: JSON.stringify(formData.value.images)
        }
        
        if (editingId.value) {
          // 编辑
          await updateVenue(editingId.value, venueData)
          ElMessage.success('场地信息更新成功')
        } else {
          // 添加
          await addVenue(venueData)
          ElMessage.success('场地添加成功')
        }
        
        dialogVisible.value = false
        // 重新加载列表
        await loadVenues()
      } catch (error) {
        console.error('保存场地失败:', error)
        ElMessage.error(error.message || '保存场地失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleToggleStatus = async (row) => {
  // 如果场地有区域，根据区域维护情况自动计算状态
  if (row.areas && row.areas.length > 0) {
    const hasMaintenanceAreas = row.areas.some(area => area.maintenance)
    if (hasMaintenanceAreas) {
      ElMessage.warning('该场地有区域正在维护中，请先在区域管理中结束维护')
      return
    }
  }
  
  // 在三种状态之间切换：available -> partial_maintenance -> maintenance -> available
  let newStatus = 'available'
  let statusText = '正常使用'
  
  if (row.status === 'available') {
    newStatus = 'partial_maintenance'
    statusText = '部分维护'
  } else if (row.status === 'partial_maintenance') {
    newStatus = 'maintenance'
    statusText = '维护中'
  } else {
    newStatus = 'available'
    statusText = '正常使用'
  }
  
  ElMessageBox.confirm(
    `确定要将场地状态改为"${statusText}"吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      // 更新场地状态
      await updateVenue(row.id, {
        ...row,
        status: newStatus,
        images: JSON.stringify(row.images)
      })
      ElMessage.success('状态更新成功')
      // 重新加载列表
      await loadVenues()
    } catch (error) {
      console.error('更新状态失败:', error)
      ElMessage.error('更新状态失败')
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该场地吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      await deleteVenue(row.id)
      ElMessage.success('场地删除成功')
      // 如果当前页没有数据了，回到上一页
      if (venues.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
      }
      // 重新加载列表
      await loadVenues()
    } catch (error) {
      console.error('删除场地失败:', error)
      ElMessage.error('删除场地失败')
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

// 区域管理相关方法
const handleManageAreas = async (row) => {
  try {
    loading.value = true
    // 从后端获取完整的场地信息（包含区域）
    const res = await getVenueById(row.id)
    currentVenue.value = res.data
    areaDialogVisible.value = true
  } catch (error) {
    console.error('加载场地详情失败:', error)
    ElMessage.error('加载场地详情失败')
  } finally {
    loading.value = false
  }
}

const handleAddArea = () => {
  areaFormTitle.value = '添加区域'
  editingAreaIndex.value = null
  areaFormData.value = {
    name: '',
    capacity: 10,
    inUse: false,
    maintenance: false
  }
  areaFormVisible.value = true
}

const handleEditArea = (row, index) => {
  areaFormTitle.value = '编辑区域'
  editingAreaIndex.value = index
  areaFormData.value = { ...row }
  areaFormVisible.value = true
}

const handleSubmitArea = async () => {
  if (!areaFormRef.value) return
  
  await areaFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        
        if (editingAreaIndex.value !== null) {
          // 编辑区域
          const area = currentVenue.value.areas[editingAreaIndex.value]
          await updateVenueArea(currentVenue.value.id, area.id, areaFormData.value)
          ElMessage.success('区域更新成功')
        } else {
          // 添加区域
          await addVenueArea(currentVenue.value.id, areaFormData.value)
          ElMessage.success('区域添加成功')
        }
        
        // 重新加载场地详情
        const res = await getVenueById(currentVenue.value.id)
        currentVenue.value = res.data
        
        // 重新加载场地列表
        await loadVenues()
        
        areaFormVisible.value = false
      } catch (error) {
        console.error('保存区域失败:', error)
        ElMessage.error(error.message || '保存区域失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleToggleAreaStatus = async (row) => {
  try {
    loading.value = true
    await toggleAreaStatus(currentVenue.value.id, row.id)
    row.inUse = !row.inUse
    ElMessage.success('区域使用状态更新成功')
    
    // 重新加载场地列表
    await loadVenues()
  } catch (error) {
    console.error('更新区域状态失败:', error)
    ElMessage.error(error.message || '更新区域状态失败')
  } finally {
    loading.value = false
  }
}

const handleToggleAreaMaintenance = async (row) => {
  try {
    loading.value = true
    await toggleAreaMaintenance(currentVenue.value.id, row.id)
    row.maintenance = !row.maintenance
    
    // 自动更新场地状态
    if (currentVenue.value) {
      currentVenue.value.status = calculateVenueStatus(currentVenue.value)
    }
    
    ElMessage.success('区域维护状态更新成功')
    
    // 重新加载场地列表
    await loadVenues()
  } catch (error) {
    console.error('更新区域维护状态失败:', error)
    ElMessage.error(error.message || '更新区域维护状态失败')
  } finally {
    loading.value = false
  }
}

const handleDeleteArea = (index) => {
  const area = currentVenue.value.areas[index]
  ElMessageBox.confirm(
    '确定要删除该区域吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      await deleteVenueArea(currentVenue.value.id, area.id)
      currentVenue.value.areas.splice(index, 1)
      ElMessage.success('区域删除成功')
      
      // 重新加载场地列表
      await loadVenues()
    } catch (error) {
      console.error('删除区域失败:', error)
      ElMessage.error(error.message || '删除区域失败')
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  loadVenues()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadVenues()
}
</script>

<style lang="scss" scoped>
@use './styles/info.scss';
</style>
