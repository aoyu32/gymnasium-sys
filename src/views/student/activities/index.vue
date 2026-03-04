<template>
  <div class="student-activities">
    <!-- 分类导航栏和创建按钮 -->
    <div class="category-nav">
      <div class="category-list">
        <div
          v-for="item in categories"
          :key="item.value"
          class="category-item"
          :class="{ active: activeCategory === item.value }"
          @click="handleCategoryChange(item.value)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div class="create-btn-wrapper">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          创建活动
        </el-button>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="活动日期">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="filterForm.activityType" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="公共活动" value="public" />
            <el-option label="私人活动" value="private" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动标签">
          <el-select v-model="filterForm.tag" placeholder="全部标签" clearable style="width: 140px">
            <el-option label="热门活动" value="hot" />
            <el-option label="新活动" value="new" />
          </el-select>
        </el-form-item>
        <el-form-item class="reset-btn-item">
          <el-button 
            :type="showMyActivities ? 'primary' : ''"
            @click="handleToggleMyActivities"
          >
            <el-icon><User /></el-icon>
            我的活动
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 活动列表 -->
    <div v-if="activities.length > 0" class="activities-grid">
      <ActivityCard
        v-for="item in activities"
        :key="item.id"
        :activity="item"
        @edit="handleEditActivity"
        @cancel="handleCancelActivity"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-empty description="暂无符合条件的活动">
        <el-button type="primary" @click="handleReset">重置筛选条件</el-button>
      </el-empty>
    </div>

    <!-- 分页 -->
    <div v-if="activities.length > 0" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 创建活动对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建私人活动"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="createForm.title" placeholder="请输入活动名称" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="活动分类" prop="category">
          <el-select v-model="createForm.category" placeholder="请选择活动分类" style="width: 100%">
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
        <el-form-item label="活动时间" prop="activityTime">
          <el-date-picker
            v-model="createForm.activityTime"
            type="datetime"
            placeholder="选择活动时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ss"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="活动地点" prop="venue">
          <el-input v-model="createForm.venue" placeholder="请输入活动地点" />
        </el-form-item>
        <el-form-item label="最大人数" prop="maxParticipants">
          <el-input-number
            v-model="createForm.maxParticipants"
            :min="2"
            :max="50"
            style="width: 100%"
          />
          <div class="form-tip">包含您自己在内的总人数</div>
        </el-form-item>
        <el-form-item label="宣传图片" prop="image">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :http-request="handleImageUpload"
            accept="image/*"
          >
            <img v-if="createForm.imageUrl" :src="createForm.imageUrl" class="uploaded-image" />
            <div v-else class="upload-placeholder">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">点击上传活动宣传图</div>
              <div class="upload-tip">支持 JPG、PNG 格式，建议尺寸 800x600</div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动详情" prop="description">
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="5"
            placeholder="请详细描述活动内容、要求、注意事项等信息"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="活动须知" prop="notice">
          <el-input
            v-model="createForm.notice"
            type="textarea"
            :rows="4"
            placeholder="请填写参加活动的注意事项，每行一条（选填）&#10;例如：&#10;请提前15分钟到达活动场地&#10;请穿着运动服装和运动鞋"
            maxlength="300"
            show-word-limit
          />
          <div class="form-tip">每行一条须知，将在活动详情页展示</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreateActivity">创建活动</el-button>
      </template>
    </el-dialog>

    <!-- 编辑活动对话框 -->
    <el-dialog
      v-model="showEditDialog"
      title="修改活动信息"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="createRules"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入活动名称" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="活动分类" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择活动分类" style="width: 100%">
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
        <el-form-item label="活动时间" prop="activityTime">
          <el-date-picker
            v-model="editForm.activityTime"
            type="datetime"
            placeholder="选择活动时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm:ss"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="活动地点" prop="venue">
          <el-input v-model="editForm.venue" placeholder="请输入活动地点" />
        </el-form-item>
        <el-form-item label="最大人数" prop="maxParticipants">
          <el-input-number
            v-model="editForm.maxParticipants"
            :min="2"
            :max="50"
            style="width: 100%"
          />
          <div class="form-tip">包含您自己在内的总人数</div>
        </el-form-item>
        <el-form-item label="宣传图片" prop="image">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :http-request="handleEditImageUpload"
            accept="image/*"
          >
            <img v-if="editForm.imageUrl" :src="editForm.imageUrl" class="uploaded-image" />
            <div v-else class="upload-placeholder">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">点击上传活动宣传图</div>
              <div class="upload-tip">支持 JPG、PNG 格式，建议尺寸 800x600</div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动详情" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="5"
            placeholder="请详细描述活动内容、要求、注意事项等信息"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="活动须知" prop="notice">
          <el-input
            v-model="editForm.notice"
            type="textarea"
            :rows="4"
            placeholder="请填写参加活动的注意事项，每行一条（选填）"
            maxlength="300"
            show-word-limit
          />
          <div class="form-tip">每行一条须知，将在活动详情页展示</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateActivity">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Basketball,
  TrophyBase,
  Football,
  Sunny,
  More,
  RefreshLeft,
  Trophy,
  Timer,
  Bicycle,
  Plus,
  User
} from '@element-plus/icons-vue'
import ActivityCard from '@/components/activity-card/index.vue'
import { getActivityPage, createActivity, getMyActivities, updateActivity, deleteActivity } from '@/api/activity'
import { uploadImage } from '@/api/file'

const activeCategory = ref('all')
const loading = ref(false)

const categories = ref([
  { label: '全部活动', value: 'all', icon: 'Sunny' },
  { label: '篮球', value: 'basketball', icon: 'Basketball' },
  { label: '足球', value: 'football', icon: 'Football' },
  { label: '羽毛球', value: 'badminton', icon: 'TrophyBase' },
  { label: '乒乓球', value: 'tabletennis', icon: 'Trophy' },
  { label: '网球', value: 'tennis', icon: 'TrophyBase' },
  { label: '排球', value: 'volleyball', icon: 'Basketball' },
  { label: '游泳', value: 'swimming', icon: 'Sunny' },
  { label: '健身', value: 'fitness', icon: 'Timer' },
  { label: '跑步', value: 'running', icon: 'Bicycle' },
  { label: '武术', value: 'martialarts', icon: 'Trophy' },
  { label: '其他', value: 'other', icon: 'More' }
])

const filterForm = ref({
  tag: '',
  dateRange: [],
  activityType: ''
})

const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const activities = ref([])
const showMyActivities = ref(false) // 是否显示我的活动

// 加载活动列表
const loadActivities = async () => {
  try {
    loading.value = true
    
    let res
    if (showMyActivities.value) {
      // 查询我的活动
      const params = {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        status: filterForm.value.status || undefined,
        activityType: filterForm.value.activityType || undefined,
        tag: filterForm.value.tag || undefined
      }
      res = await getMyActivities(params)
    } else {
      // 查询所有活动
      const params = {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        category: activeCategory.value !== 'all' ? activeCategory.value : undefined,
        activityType: filterForm.value.activityType || undefined,
        tag: filterForm.value.tag || undefined
      }
      res = await getActivityPage(params)
    }
    
    // 转换数据格式以匹配ActivityCard组件
    let filteredActivities = res.data.records.map(item => ({
      ...item,
      time: formatDateTime(item.activityTime),
      venue: item.venueName || item.areaName || '待定',
      participants: item.currentParticipants,
      statusText: item.tag === 'hot' ? '热门' : item.tag === 'new' ? '新活动' : '',
      activityTimeRaw: new Date(item.activityTime), // 保留原始时间用于筛选
      isMyActivity: showMyActivities.value // 标记是否是我的活动
    }))
    
    // 日期范围
    if (filterForm.value.dateRange && filterForm.value.dateRange.length === 2) {
      const [startDate, endDate] = filterForm.value.dateRange
      filteredActivities = filteredActivities.filter(item => {
        const activityDate = item.activityTimeRaw
        return activityDate >= startDate && activityDate <= endDate
      })
    }
    
    activities.value = filteredActivities
    total.value = filteredActivities.length
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
  loadActivities()
})

// 监听筛选条件变化
watch([activeCategory, filterForm], () => {
  currentPage.value = 1
  loadActivities()
}, { deep: true })

const handleCategoryChange = (category) => {
  activeCategory.value = category
  const categoryLabel = categories.value.find(c => c.value === category)?.label
  ElMessage.success(`切换到：${categoryLabel}`)
}

const handleReset = () => {
  filterForm.value = {
    tag: '',
    dateRange: [],
    activityType: ''
  }
  activeCategory.value = 'all'
  currentPage.value = 1
  showMyActivities.value = false
  loadActivities()
  ElMessage.info('已重置筛选条件')
}

// 显示我的活动（切换状态）
const handleToggleMyActivities = () => {
  showMyActivities.value = !showMyActivities.value
  currentPage.value = 1
  loadActivities()
  
  if (showMyActivities.value) {
    ElMessage.success('正在查看我的活动')
  } else {
    ElMessage.info('已切换到活动中心')
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadActivities()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 创建活动
const showCreateDialog = ref(false)
const createFormRef = ref(null)

// 编辑活动
const showEditDialog = ref(false)
const editFormRef = ref(null)
const editingActivityId = ref(null)

const createForm = ref({
  title: '',
  category: '',
  activityTime: '',
  venue: '',
  maxParticipants: 10,
  description: '',
  imageUrl: '',
  notice: ''
})

const editForm = ref({
  title: '',
  category: '',
  activityTime: '',
  venue: '',
  maxParticipants: 10,
  description: '',
  notice: '',
  imageUrl: ''
})

const createRules = {
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择活动分类', trigger: 'change' }],
  activityTime: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  venue: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  maxParticipants: [{ required: true, message: '请输入最大人数', trigger: 'blur' }],
  description: [{ required: true, message: '请输入活动详情', trigger: 'blur' }]
}

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

// 图片上传
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleImageUpload = async (options) => {
  const { file } = options
  try {
    // 调用后端文件上传接口
    const res = await uploadImage(file, 'activity')
    createForm.value.imageUrl = res.data
    ElMessage.success('图片上传成功')
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error(error.message || '图片上传失败')
  }
  return Promise.resolve()
}

const handleEditImageUpload = async (options) => {
  const { file } = options
  try {
    // 调用后端文件上传接口
    const res = await uploadImage(file, 'activity')
    editForm.value.imageUrl = res.data
    ElMessage.success('图片上传成功')
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error(error.message || '图片上传失败')
  }
  return Promise.resolve()
}

const handleCreateActivity = async () => {
  if (!createFormRef.value) return
  
  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const submitData = {
          title: createForm.value.title,
          category: createForm.value.category,
          activityType: 'private', // 学生创建的是私有活动
          activityTime: createForm.value.activityTime,
          areaName: createForm.value.venue,
          maxParticipants: createForm.value.maxParticipants,
          description: createForm.value.description,
          notice: createForm.value.notice,
          image: createForm.value.imageUrl
        }
        await createActivity(submitData)
        ElMessage.success('活动创建成功，等待审核')
        showCreateDialog.value = false
        createForm.value = {
          title: '',
          category: '',
          activityTime: '',
          venue: '',
          maxParticipants: 10,
          description: '',
          imageUrl: '',
          notice: ''
        }
        // 重新加载列表
        loadActivities()
      } catch (error) {
        console.error('创建活动失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

// 编辑活动
const handleEditActivity = (activity) => {
  editingActivityId.value = activity.id
  editForm.value = {
    title: activity.title,
    category: activity.category,
    activityTime: activity.activityTime,
    venue: activity.areaName || activity.venueName || '',
    maxParticipants: activity.maxParticipants,
    description: activity.description,
    notice: activity.notice || '',
    imageUrl: activity.image || ''
  }
  showEditDialog.value = true
}

// 保存修改
const handleUpdateActivity = async () => {
  if (!editFormRef.value) return
  
  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const submitData = {
          title: editForm.value.title,
          category: editForm.value.category,
          activityType: 'private',
          activityTime: editForm.value.activityTime,
          areaName: editForm.value.venue,
          maxParticipants: editForm.value.maxParticipants,
          description: editForm.value.description,
          notice: editForm.value.notice,
          image: editForm.value.imageUrl
        }
        await updateActivity(editingActivityId.value, submitData)
        ElMessage.success('活动修改成功')
        showEditDialog.value = false
        // 重新加载列表
        loadActivities()
      } catch (error) {
        console.error('修改活动失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

// 取消活动
const handleCancelActivity = async (activity) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消活动"${activity.title}"吗？取消后将无法恢复。`,
      '取消活动',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    await deleteActivity(activity.id)
    ElMessage.success('活动已取消')
    // 重新加载列表
    loadActivities()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消活动失败:', error)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
