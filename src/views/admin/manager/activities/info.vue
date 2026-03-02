<template>
  <div class="activity-info-management">
    <el-card>
      <template #header>
        <div class="header">
          <span>活动信息管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加活动
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索活动名称"
          clearable
          style="width: 300px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCategory" placeholder="活动分类" clearable style="width: 150px; margin-left: 12px">
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
        <el-select v-model="filterType" placeholder="活动类型" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="公共活动" value="public" />
          <el-option label="私人活动" value="private" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="活动状态" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="报名中" value="ongoing" />
          <el-option label="已满员" value="full" />
          <el-option label="已结束" value="ended" />
        </el-select>
      </div>

      <!-- 活动列表 -->
      <el-table :data="paginatedActivities" stripe style="margin-top: 20px">
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
        <el-table-column prop="title" label="活动名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="category" label="活动分类" width="100">
          <template #default="{ row }">
            {{ getCategoryLabel(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="activityType" label="活动类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.activityType === 'public' ? 'info' : ''" size="small">
              {{ row.activityType === 'public' ? '公共活动' : '私人活动' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" width="100">
          <template #default="{ row }">
            {{ row.creator }}
          </template>
        </el-table-column>
        <el-table-column prop="time" label="活动时间" width="160" />
        <el-table-column prop="venue" label="活动地点" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.venue }}{{ row.area ? ` - ${row.area}` : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="participants" label="参与人数" width="110">
          <template #default="{ row }">
            {{ row.participants }}/{{ row.maxParticipants }}人
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getActivityStatusType(row)" size="small">
              {{ getActivityStatusText(row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div style="display: flex; gap: 8px; flex-wrap: nowrap; white-space: nowrap;">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">查看详情</el-button>
              <el-button 
                link 
                type="primary" 
                size="small" 
                :disabled="!canEdit(row)"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button 
                link 
                type="danger" 
                size="small" 
                :disabled="!canDelete(row)"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
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
            <el-form-item label="活动名称" prop="title">
              <el-input v-model="formData.title" placeholder="请输入活动名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动分类" prop="category">
              <el-select v-model="formData.category" placeholder="请选择活动分类" style="width: 100%">
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动时间" prop="activityTime">
              <el-date-picker
                v-model="formData.activityTime"
                type="datetime"
                placeholder="选择活动时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DDTHH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场地" prop="areaName">
              <el-input v-model="formData.areaName" placeholder="请输入场地名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最大人数" prop="maxParticipants">
              <el-input-number v-model="formData.maxParticipants" :min="1" :max="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动标签" prop="tag">
              <el-select v-model="formData.tag" placeholder="请选择活动标签" clearable style="width: 100%">
                <el-option label="无标签" value="" />
                <el-option label="热门活动" value="hot" />
                <el-option label="新活动" value="new" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动封面" prop="image">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :http-request="handleImageUpload"
          >
            <img v-if="formData.image" :src="formData.image" class="uploaded-image" />
            <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：400x300，支持jpg、png格式</div>
        </el-form-item>
        <el-form-item label="活动详情" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="5"
            placeholder="请详细描述活动内容、要求、注意事项等信息"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="活动须知" prop="notice">
          <el-input
            v-model="formData.notice"
            type="textarea"
            :rows="4"
            placeholder="请填写参加活动的注意事项，每行一条（选填）"
            maxlength="300"
            show-word-limit
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
      title="活动详情"
      width="800px"
    >
      <div class="activity-detail" v-if="currentActivity">
        <!-- 活动封面 -->
        <div class="detail-section">
          <el-image
            :src="currentActivity.image"
            fit="cover"
            style="width: 100%; height: 300px; border-radius: 8px"
            :preview-src-list="[currentActivity.image]"
          />
        </div>

        <!-- 基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动名称：</span>
                <span class="value">{{ currentActivity.title }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动分类：</span>
                <span class="value">{{ getCategoryLabel(currentActivity.category) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动时间：</span>
                <span class="value">{{ currentActivity.time }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动地点：</span>
                <span class="value">{{ currentActivity.venue }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">参与人数：</span>
                <span class="value">{{ currentActivity.participants }}/{{ currentActivity.maxParticipants }}人</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动类型：</span>
                <el-tag :type="currentActivity.activityType === 'public' ? 'info' : ''" size="small">
                  {{ currentActivity.activityType === 'public' ? '公共活动' : '私人活动' }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">创建人：</span>
                <span class="value">{{ currentActivity.creator }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动状态：</span>
                <el-tag :type="getActivityStatusType(currentActivity)" size="small">
                  {{ getActivityStatusText(currentActivity) }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 活动详情 -->
        <div class="detail-section" v-if="currentActivity.description">
          <h3 class="section-title">活动详情</h3>
          <p class="description-text">{{ currentActivity.description }}</p>
        </div>

        <!-- 活动须知 -->
        <div class="detail-section" v-if="currentActivity.notice">
          <h3 class="section-title">活动须知</h3>
          <ul class="notice-list">
            <li v-for="(item, index) in currentActivity.notice.split('\n')" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { getActivityPage, createActivity, updateActivity, deleteActivity, getActivityById } from '@/api/activity'

const searchKeyword = ref('')
const filterCategory = ref('')
const filterType = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('添加活动')
const formRef = ref(null)
const editingId = ref(null)
const currentActivity = ref(null)
const loading = ref(false)
const currentUserId = ref(null) // 当前登录用户ID

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const formData = ref({
  title: '',
  category: '',
  activityTime: '',
  areaName: '',
  maxParticipants: 10,
  activityType: 'public',
  image: '',
  description: '',
  notice: '',
  tag: ''
})

const rules = {
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择活动分类', trigger: 'change' }],
  activityTime: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  areaName: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  maxParticipants: [{ required: true, message: '请输入最大人数', trigger: 'blur' }],
  description: [{ required: true, message: '请输入活动详情', trigger: 'blur' }]
}

const activitiesList = ref([])

// 加载活动列表
const loadActivities = async () => {
  try {
    loading.value = true
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      category: filterCategory.value || undefined,
      activityType: filterType.value || undefined,
      keyword: searchKeyword.value || undefined,
      approvalStatus: 'all' // 传入'all'表示查询所有审核状态的活动
    }
    const res = await getActivityPage(params)
    
    // 转换数据格式
    activitiesList.value = res.data.records.map(item => ({
      ...item,
      time: formatDateTime(item.activityTime),
      venue: item.areaName || item.venueName || '待定',
      participants: item.currentParticipants,
      creator: item.creatorName || '未知'
    }))
    
    total.value = res.data.total
  } catch (error) {
    console.error('加载活动列表失败:', error)
    ElMessage.error('加载活动列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  const date = new Date(dateTimeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 初始化加载
onMounted(() => {
  // 从localStorage获取当前用户ID（登录时应该存储了userId）
  const userId = localStorage.getItem('userId')
  if (userId) {
    currentUserId.value = parseInt(userId)
  }
  console.log('当前用户ID:', currentUserId.value)
  loadActivities()
})

// 判断是否可以编辑
// 规则：只能编辑自己创建的活动，或者场地负责人可以编辑学生创建的私人活动
const canEdit = (activity) => {
  const role = localStorage.getItem('role')
  // 如果是自己创建的活动，可以编辑
  if (activity.creatorId === currentUserId.value) {
    return true
  }
  // 如果是场地负责人，可以编辑学生创建的私人活动
  if (role === 'manager' && activity.activityType === 'private') {
    return true
  }
  return false
}

// 判断是否可以删除
// 规则：只能删除自己创建的活动，或者场地负责人可以删除学生创建的私人活动
const canDelete = (activity) => {
  const role = localStorage.getItem('role')
  // 如果是自己创建的活动，可以删除
  if (activity.creatorId === currentUserId.value) {
    return true
  }
  // 如果是场地负责人，可以删除学生创建的私人活动
  if (role === 'manager' && activity.activityType === 'private') {
    return true
  }
  return false
}

const filteredActivities = computed(() => {
  return activitiesList.value.filter(activity => {
    const matchKeyword = !searchKeyword.value || activity.title.includes(searchKeyword.value)
    const matchCategory = !filterCategory.value || activity.category === filterCategory.value
    const matchType = !filterType.value || activity.activityType === filterType.value
    
    let matchStatus = true
    if (filterStatus.value) {
      const status = getActivityStatus(activity)
      matchStatus = status === filterStatus.value
    }
    
    return matchKeyword && matchCategory && matchType && matchStatus
  })
})

// 分页后的数据
const paginatedActivities = computed(() => {
  return filteredActivities.value
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

const getActivityStatus = (activity) => {
  const activityDate = new Date(activity.time)
  const now = new Date()
  
  if (activityDate < now) return 'ended'
  if (activity.participants >= activity.maxParticipants) return 'full'
  return 'ongoing'
}

const getActivityStatusType = (activity) => {
  const status = getActivityStatus(activity)
  const typeMap = {
    ongoing: 'success',
    full: 'warning',
    ended: 'info'
  }
  return typeMap[status] || 'info'
}

const getActivityStatusText = (activity) => {
  const status = getActivityStatus(activity)
  const textMap = {
    ongoing: '报名中',
    full: '已满员',
    ended: '已结束'
  }
  return textMap[status] || ''
}

const handleAdd = () => {
  dialogTitle.value = '添加活动'
  editingId.value = null
  formData.value = {
    title: '',
    category: '',
    activityTime: '',
    areaName: '',
    maxParticipants: 10,
    activityType: 'public',
    image: '',
    description: '',
    notice: '',
    tag: ''
  }
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  try {
    loading.value = true
    const res = await getActivityById(row.id)
    dialogTitle.value = '编辑活动'
    editingId.value = row.id
    formData.value = {
      title: res.data.title,
      category: res.data.category,
      activityTime: res.data.activityTime,
      areaName: res.data.areaName || res.data.venueName || '',
      maxParticipants: res.data.maxParticipants,
      activityType: res.data.activityType,
      image: res.data.image || '',
      description: res.data.description || '',
      notice: res.data.notice || '',
      tag: res.data.tag || ''
    }
    dialogVisible.value = true
  } catch (error) {
    console.error('加载活动详情失败:', error)
    ElMessage.error('加载活动详情失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const submitData = {
          title: formData.value.title,
          category: formData.value.category,
          // activityType由后端根据用户角色自动设置，不需要前端传递
          activityTime: formData.value.activityTime,
          areaName: formData.value.areaName,
          maxParticipants: formData.value.maxParticipants,
          description: formData.value.description,
          notice: formData.value.notice,
          image: formData.value.image,
          tag: formData.value.tag
        }
        
        if (editingId.value) {
          await updateActivity(editingId.value, submitData)
          ElMessage.success('活动信息更新成功')
        } else {
          await createActivity(submitData)
          ElMessage.success('活动添加成功')
        }
        
        dialogVisible.value = false
        loadActivities()
      } catch (error) {
        console.error('操作失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

const handleViewDetail = async (row) => {
  try {
    loading.value = true
    const res = await getActivityById(row.id)
    currentActivity.value = {
      ...res.data,
      time: formatDateTime(res.data.activityTime),
      venue: res.data.areaName || res.data.venueName || '待定',
      participants: res.data.currentParticipants,
      creator: res.data.creatorName || '未知'
    }
    detailVisible.value = true
  } catch (error) {
    console.error('加载活动详情失败:', error)
    ElMessage.error('加载活动详情失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该活动吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      loading.value = true
      await deleteActivity(row.id)
      ElMessage.success('活动删除成功')
      loadActivities()
    } catch (error) {
      console.error('删除失败:', error)
    } finally {
      loading.value = false
    }
  }).catch(() => {})
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  loadActivities()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadActivities()
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
const handleImageUpload = (options) => {
  const { file } = options
  // 这里模拟上传，实际项目中应该调用上传API
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.image = e.target.result
    ElMessage.success('图片上传成功')
  }
  reader.readAsDataURL(file)
}
</script>

<style lang="scss" scoped>
@use './styles/info.scss';
</style>
