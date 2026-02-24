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
        <el-form-item label="活动状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="报名中" value="open" />
            <el-option label="已满员" value="full" />
            <el-option label="已结束" value="closed" />
          </el-select>
        </el-form-item>
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
        <el-form-item label="人数范围">
          <div class="participants-range">
            <el-input-number
              v-model="filterForm.minParticipants"
              :min="0"
              :max="100"
              placeholder="最少人数"
              controls-position="right"
              style="width: 130px"
            />
            <span class="range-separator">-</span>
            <el-input-number
              v-model="filterForm.maxParticipants"
              :min="0"
              :max="100"
              placeholder="最多人数"
              controls-position="right"
              style="width: 130px"
            />
          </div>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="filterForm.activityType" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="公共活动" value="public" />
            <el-option label="私人活动" value="private" />
          </el-select>
        </el-form-item>
        <el-form-item class="reset-btn-item">
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
        <el-form-item label="活动时间" prop="time">
          <el-date-picker
            v-model="createForm.time"
            type="datetime"
            placeholder="选择活动时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
  Plus
} from '@element-plus/icons-vue'
import ActivityCard from '@/components/activity-card/index.vue'
import { activities as mockActivities } from '@/mock/activities'

const activeCategory = ref('all')

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
  status: '',
  dateRange: [],
  minParticipants: null,
  maxParticipants: null,
  activityType: ''
})

const currentPage = ref(1)
const pageSize = ref(12)

// 筛选后的活动列表
const filteredActivities = computed(() => {
  let result = [...mockActivities]
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value)
  }
  
  // 按活动状态筛选
  if (filterForm.value.status) {
    result = result.filter(item => {
      const activityDate = new Date(item.time)
      const now = new Date()
      
      if (filterForm.value.status === 'open') {
        // 报名中：未满员且未结束
        return item.participants < item.maxParticipants && activityDate >= now
      } else if (filterForm.value.status === 'full') {
        // 已满员：参与人数达到上限
        return item.participants >= item.maxParticipants && activityDate >= now
      } else if (filterForm.value.status === 'closed') {
        // 已结束：活动时间已过
        return activityDate < now
      }
      return true
    })
  }
  
  // 按日期范围筛选
  if (filterForm.value.dateRange && filterForm.value.dateRange.length === 2) {
    const [startDate, endDate] = filterForm.value.dateRange
    result = result.filter(item => {
      const activityDate = new Date(item.time)
      return activityDate >= startDate && activityDate <= endDate
    })
  }
  
  // 按人数范围筛选
  if (filterForm.value.minParticipants !== null && filterForm.value.minParticipants > 0) {
    result = result.filter(item => item.maxParticipants >= filterForm.value.minParticipants)
  }
  if (filterForm.value.maxParticipants !== null && filterForm.value.maxParticipants > 0) {
    result = result.filter(item => item.maxParticipants <= filterForm.value.maxParticipants)
  }
  
  // 按活动类型筛选
  if (filterForm.value.activityType) {
    result = result.filter(item => item.activityType === filterForm.value.activityType)
  }
  
  return result
})

// 总数
const total = computed(() => filteredActivities.value.length)

// 当前页显示的活动
const activities = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredActivities.value.slice(start, end)
})

// 监听筛选条件变化，重置到第一页
watch([activeCategory, filterForm], () => {
  currentPage.value = 1
}, { deep: true })

const handleCategoryChange = (category) => {
  activeCategory.value = category
  const categoryLabel = categories.value.find(c => c.value === category)?.label
  ElMessage.success(`切换到：${categoryLabel}`)
}

const handleReset = () => {
  filterForm.value = {
    status: '',
    dateRange: [],
    minParticipants: null,
    maxParticipants: null,
    activityType: ''
  }
  activeCategory.value = 'all'
  ElMessage.info('已重置筛选条件')
}

const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 创建活动
const showCreateDialog = ref(false)
const createFormRef = ref(null)

const createForm = ref({
  title: '',
  category: '',
  time: '',
  venue: '',
  maxParticipants: 10,
  description: '',
  imageUrl: '',
  notice: ''
})

const createRules = {
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择活动分类', trigger: 'change' }],
  time: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
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

const handleImageUpload = (options) => {
  const { file } = options
  // 这里使用本地预览，实际项目中应该上传到服务器
  const reader = new FileReader()
  reader.onload = (e) => {
    createForm.value.imageUrl = e.target.result
    ElMessage.success('图片上传成功')
  }
  reader.readAsDataURL(file)
  return Promise.resolve()
}

const handleCreateActivity = async () => {
  if (!createFormRef.value) return
  
  await createFormRef.value.validate((valid) => {
    if (valid) {
      if (!createForm.value.imageUrl) {
        ElMessage.warning('请上传活动宣传图片')
        return
      }
      ElMessage.success('活动创建成功，等待审核')
      showCreateDialog.value = false
      createForm.value = {
        title: '',
        category: '',
        time: '',
        venue: '',
        maxParticipants: 10,
        description: '',
        imageUrl: '',
        notice: ''
      }
      // 这里后期对接API
    }
  })
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
