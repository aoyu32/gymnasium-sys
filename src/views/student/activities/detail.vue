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
        <div class="info-card">
          <h2>活动须知</h2>
          <ul class="notice-list">
            <li>请提前15分钟到达活动场地</li>
            <li>请穿着运动服装和运动鞋</li>
            <li>请自备水杯，注意补充水分</li>
            <li>如有身体不适，请及时告知组织者</li>
            <li>请遵守场地规则，爱护公共设施</li>
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
                placeholder="请简要说明参加活动的理由"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :disabled="!canApply"
                @click="handleSubmit"
              >
                {{ getButtonText }}
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 温馨提示 -->
          <el-alert
            v-if="canApply"
            title="温馨提示"
            type="info"
            :closable="false"
            show-icon
          >
            <p>提交申请后，请等待审核通过。审核结果将通过短信或邮件通知您。</p>
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
import { activities } from '@/mock/activities'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

// 获取活动详情
const activity = ref(null)

onMounted(() => {
  const id = parseInt(route.params.id)
  activity.value = activities.find(item => item.id === id)
})

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
  const descriptions = {
    basketball: '本次篮球活动旨在促进同学们之间的交流与合作，提高篮球技能。无论你是篮球高手还是初学者，都欢迎参加。我们将进行友谊赛和技巧训练，让每个人都能享受篮球的乐趣。',
    football: '足球是一项充满激情的运动，本次活动将组织友谊赛和基础训练。欢迎所有热爱足球的同学参加，一起在绿茵场上挥洒汗水，感受团队合作的魅力。',
    badminton: '羽毛球是一项老少皆宜的运动，本次活动将提供专业教练指导，帮助大家提高技术水平。无论是单打还是双打，都能找到适合自己的训练方式。',
    tabletennis: '乒乓球作为国球，深受大家喜爱。本次活动将举办比赛和训练，让大家在切磋中提高球技，在交流中增进友谊。',
    tennis: '网球是一项优雅的运动，本次活动将提供专业场地和器材，欢迎网球爱好者参加。我们将进行技术指导和友谊赛，让大家享受网球的乐趣。',
    volleyball: '排球是一项团队运动，强调配合与默契。本次活动将组织训练和比赛，让大家在运动中增强体质，培养团队精神。',
    swimming: '游泳是一项全身运动，对身体健康非常有益。本次活动将提供专业教练指导，帮助大家掌握正确的游泳技巧，提高游泳水平。',
    fitness: '健身活动将提供专业的器械和指导，帮助大家科学锻炼，塑造健康体魄。无论是增肌还是减脂，都能找到适合自己的训练方案。',
    running: '跑步是最简单有效的运动方式，本次活动将组织集体晨跑，让大家在清晨的阳光下开启活力的一天，享受运动的快乐。',
    martialarts: '武术是中华传统文化的瑰宝，本次活动将教授基本功和套路，让大家感受武术的魅力，强身健体，修身养性。',
    other: '本次活动将为大家提供一个交流和锻炼的平台，欢迎所有热爱运动的同学参加，一起享受运动的乐趣。'
  }
  return descriptions[activity.value?.category] || descriptions.other
})

// 活动状态
const getStatusTagType = computed(() => {
  if (!activity.value) return 'info'
  const activityDate = new Date(activity.value.time)
  const now = new Date()
  
  if (activityDate < now) return 'info'
  if (activity.value.participants >= activity.value.maxParticipants) return 'warning'
  return 'success'
})

const getStatusText = computed(() => {
  if (!activity.value) return ''
  const activityDate = new Date(activity.value.time)
  const now = new Date()
  
  if (activityDate < now) return '已结束'
  if (activity.value.participants >= activity.value.maxParticipants) return '已满员'
  return '报名中'
})

// 剩余名额
const remainingSlots = computed(() => {
  if (!activity.value) return 0
  return activity.value.maxParticipants - activity.value.participants
})

// 是否可以申请
const canApply = computed(() => {
  if (!activity.value) return false
  const activityDate = new Date(activity.value.time)
  const now = new Date()
  return activityDate >= now && activity.value.participants < activity.value.maxParticipants
})

const getButtonText = computed(() => {
  if (!activity.value) return '提交申请'
  const activityDate = new Date(activity.value.time)
  const now = new Date()
  
  if (activityDate < now) return '活动已结束'
  if (activity.value.participants >= activity.value.maxParticipants) return '名额已满'
  return '提交申请'
})

// 申请表单
const applyForm = ref({
  name: '',
  phone: '',
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
  studentId: [{ required: true, message: '请输入学号或工号', trigger: 'blur' }],
  college: [{ required: true, message: '请选择所属学院', trigger: 'change' }],
  reason: [{ required: true, message: '请填写申请理由', trigger: 'blur' }]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('申请提交成功，请等待审核')
      // 这里后期对接API
      setTimeout(() => {
        router.push('/student/activities')
      }, 1500)
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
