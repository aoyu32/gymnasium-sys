<template>
  <div class="activity-detail">
    <div v-if="activity" class="detail-container">
      <!-- 左侧：活动信息 -->
      <div class="activity-info-section">
        <!-- 活动封面 -->
        <div class="activity-cover">
          <img :src="activity.image" :alt="activity.title" />
          <div class="cover-overlay">
            <div class="activity-tag" :class="activity.status">{{ activity.statusText }}</div>
          </div>
        </div>

        <!-- 活动基本信息 -->
        <div class="info-card">
          <div class="card-header">
            <h1>{{ activity.title }}</h1>
            <el-tag :type="getStatusTagType" size="large">{{ getStatusText }}</el-tag>
          </div>

          <el-descriptions :column="1" border class="activity-descriptions">
            <el-descriptions-item label="活动时间">
              <el-icon><Clock /></el-icon>
              {{ activity.time }}
            </el-descriptions-item>
            <el-descriptions-item label="活动地点">
              <el-icon><Location /></el-icon>
              {{ activity.venue }}{{ activity.area ? ` - ${activity.area}` : '' }}
            </el-descriptions-item>
            <el-descriptions-item label="参与人数">
              <el-icon><User /></el-icon>
              {{ activity.participants }}/{{ activity.maxParticipants }}人
            </el-descriptions-item>
            <el-descriptions-item label="活动类型">
              <el-tag :type="activity.activityType === 'public' ? 'info' : ''" effect="plain">
                {{ activity.activityType === 'public' ? '公共活动' : '私人活动' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="活动分类">
              <el-tag type="success" effect="plain">{{ getCategoryLabel }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建人">
              {{ activity.creator }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 活动详情 -->
        <div class="info-card">
          <h2>活动详情</h2>
          <div class="activity-description">
            <p>{{ activityDescription }}</p>
          </div>
        </div>

        <!-- 活动须知 -->
        <div v-if="activity.notice" class="info-card">
          <h2>活动须知</h2>
          <ul class="notice-list">
            <li v-for="(item, index) in noticeList" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>

      <!-- 右侧：申请表单 -->
      <div class="apply-form-section">
        <div class="form-card">
          <h2>申请参加</h2>
          <el-form
            ref="formRef"
            :model="applyForm"
            :rules="rules"
            label-width="100px"
            label-position="top"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="applyForm.name" placeholder="请输入您的姓名" />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="applyForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="联系邮箱" prop="email">
              <el-input v-model="applyForm.email" placeholder="请输入联系邮箱" />
            </el-form-item>
            <el-form-item label="学号/工号" prop="studentId">
              <el-input v-model="applyForm.studentId" placeholder="请输入学号或工号" />
            </el-form-item>
            <el-form-item label="所属学院" prop="college">
              <el-select v-model="applyForm.college" placeholder="请选择所属学院" style="width: 100%">
                <el-option label="计算机学院" value="计算机学院" />
                <el-option label="软件学院" value="软件学院" />
                <el-option label="信息学院" value="信息学院" />
                <el-option label="电子工程学院" value="电子工程学院" />
                <el-option label="机械工程学院" value="机械工程学院" />
                <el-option label="材料科学学院" value="材料科学学院" />
                <el-option label="化学化工学院" value="化学化工学院" />
                <el-option label="生命科学学院" value="生命科学学院" />
                <el-option label="数学学院" value="数学学院" />
                <el-option label="物理学院" value="物理学院" />
                <el-option label="经济管理学院" value="经济管理学院" />
                <el-option label="外国语学院" value="外国语学院" />
                <el-option label="人文学院" value="人文学院" />
                <el-option label="艺术学院" value="艺术学院" />
                <el-option label="体育学院" value="体育学院" />
              </el-select>
            </el-form-item>
            <el-form-item label="申请理由" prop="reason">
              <el-input
                v-model="applyForm.reason"
                type="textarea"
                :rows="4"
                placeholder="请简要说明参加活动的理由（选填）"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :disabled="!canApply"
                :loading="loading"
                @click="handleSubmit"
              >
                {{ getButtonText }}
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 温馨提示 -->
          <el-alert
            v-if="canApply && activity.activityType === 'private'"
            title="温馨提示"
            type="info"
            :closable="false"
            show-icon
          >
            <p>这是私人活动，提交申请后需要等待创建者审核通过。</p>
          </el-alert>
          <el-alert
            v-else-if="canApply"
            title="温馨提示"
            type="success"
            :closable="false"
            show-icon
          >
            <p>这是公开活动，提交申请后即可参加。</p>
          </el-alert>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <el-empty description="活动不存在或已被删除">
        <el-button type="primary" @click="goBack">返回活动列表</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Clock, Location, User } from '@element-plus/icons-vue'
import { getActivityById, registerActivity } from '@/api/activity'
import { getCurrentStudentInfo } from '@/api/student'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

// 获取活动详情
const activity = ref(null)
const loading = ref(false)

onMounted(async () => {
  await loadActivityDetail()
  await loadStudentInfo()
})

// 加载活动详情
const loadActivityDetail = async () => {
  try {
    loading.value = true
    const id = parseInt(route.params.id)
    const res = await getActivityById(id)
    
    // 转换数据格式
    activity.value = {
      ...res.data,
      time: formatDateTime(res.data.activityTime),
      venue: res.data.venueName || res.data.areaName || '待定',
      area: res.data.areaName,
      participants: res.data.currentParticipants,
      maxParticipants: res.data.maxParticipants,
      creator: res.data.creatorName,
      statusText: res.data.tag === 'hot' ? '热门' : res.data.tag === 'new' ? '新活动' : ''
    }
  } catch (error) {
    console.error('加载活动详情失败:', error)
    ElMessage.error('加载活动详情失败')
  } finally {
    loading.value = false
  }
}

// 加载学生信息并自动填充表单
const loadStudentInfo = async () => {
  try {
    const res = await getCurrentStudentInfo()
    if (res.data) {
      // 定义有效的学院列表
      const validColleges = [
        '计算机学院', '软件学院', '信息学院', '电子工程学院', '机械工程学院',
        '材料科学学院', '化学化工学院', '生命科学学院', '数学学院', '物理学院',
        '经济管理学院', '外国语学院', '人文学院', '艺术学院', '体育学院'
      ]
      
      // 自动填充表单
      applyForm.value.name = res.data.name || ''
      applyForm.value.phone = res.data.phone || ''
      applyForm.value.email = res.data.email || ''
      applyForm.value.studentId = res.data.studentId || ''
      
      // 只有当college值在有效列表中时才自动填充
      if (res.data.college && validColleges.includes(res.data.college)) {
        applyForm.value.college = res.data.college
      }
    }
  } catch (error) {
    console.error('加载学生信息失败:', error)
    // 加载失败不影响用户手动填写，不显示错误提示
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

// 分类标签映射
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

const getCategoryLabel = computed(() => {
  return categoryMap[activity.value?.category] || '其他'
})

// 活动详情描述
const activityDescription = computed(() => {
  return activity.value?.description || '暂无活动详情'
})

// 活动须知列表
const noticeList = computed(() => {
  if (!activity.value?.notice) return []
  return activity.value.notice.split('\n').filter(item => item.trim())
})

// 活动状态
const getStatusTagType = computed(() => {
  if (!activity.value) return 'info'
  
  // 根据活动状态返回标签类型
  switch (activity.value.status) {
    case 'open':
      return 'success'
    case 'ongoing':
      return 'warning'
    case 'closed':
      return 'info'
    case 'cancelled':
      return 'danger'
    default:
      return 'info'
  }
})

const getStatusText = computed(() => {
  if (!activity.value) return ''
  
  // 根据活动状态返回文本
  switch (activity.value.status) {
    case 'open':
      if (activity.value.participants >= activity.value.maxParticipants) {
        return '已满员'
      }
      return '报名中'
    case 'ongoing':
      return '进行中'
    case 'closed':
      return '已结束'
    case 'cancelled':
      return '已取消'
    default:
      return '未知状态'
  }
})

// 剩余名额
const remainingSlots = computed(() => {
  if (!activity.value) return 0
  return activity.value.maxParticipants - activity.value.participants
})

// 是否可以申请
const canApply = computed(() => {
  if (!activity.value) return false
  // 只有报名中且未满员且未报名的活动可以申请
  return activity.value.status === 'open' && 
         activity.value.participants < activity.value.maxParticipants &&
         !activity.value.isRegistered
})

const getButtonText = computed(() => {
  if (!activity.value) return '提交申请'
  
  if (activity.value.isRegistered) return '已报名'
  
  switch (activity.value.status) {
    case 'open':
      if (activity.value.participants >= activity.value.maxParticipants) {
        return '名额已满'
      }
      return '提交申请'
    case 'ongoing':
      return '活动进行中'
    case 'closed':
      return '活动已结束'
    case 'cancelled':
      return '活动已取消'
    default:
      return '提交申请'
  }
})

// 申请表单
const applyForm = ref({
  name: '',
  phone: '',
  email: '',
  studentId: '',
  college: '',
  reason: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  studentId: [{ required: true, message: '请输入学号或工号', trigger: 'blur' }],
  college: [{ required: true, message: '请选择所属学院', trigger: 'change' }],
  reason: [{ required: false, message: '请填写申请理由', trigger: 'blur' }]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        // 调用报名接口，传递申请理由
        await registerActivity(activity.value.id, applyForm.value.reason)
        ElMessage.success('报名成功')
        // 重新加载活动详情
        await loadActivityDetail()
      } catch (error) {
        console.error('报名失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

const goBack = () => {
  router.push('/student/activities')
}
</script>

<style lang="scss" scoped>
@use './styles/detail.scss';
</style>
