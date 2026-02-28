<template>
  <div class="venue-detail">
    <div v-if="venue" class="detail-container">
      <!-- 左侧：场地信息 -->
      <div class="venue-info-section">
        <!-- 场地图片轮播 -->
        <ImageCarousel :images="venue.images" height="400px" />

        <!-- 场地基本信息 -->
        <div class="info-card">
          <div class="card-header">
            <h1>{{ venue.name }}</h1>
            <el-tag :type="venue.status === 'available' ? 'success' : 'warning'" size="large">
              {{ venue.status === 'available' ? '可申请' : '使用中' }}
            </el-tag>
          </div>

          <el-descriptions :column="1" border class="venue-descriptions">
            <el-descriptions-item label="场地分类">
              <el-icon><Basketball /></el-icon>
              {{ getCategoryLabel }}
            </el-descriptions-item>
            <el-descriptions-item label="容纳人数">
              <el-icon><User /></el-icon>
              {{ venue.capacity }}人
            </el-descriptions-item>
            <el-descriptions-item label="区域状态">
              <div v-if="venue.areas && venue.areas.length > 0" class="area-status-list">
                <div v-for="area in venue.areas" :key="area.id" class="area-status-item">
                  <div class="area-info">
                    <span class="area-name">{{ area.name }}</span>
                    <span class="area-capacity">容纳{{ area.capacity }}人</span>
                  </div>
                  <el-tag :type="area.inUse ? 'danger' : 'success'" size="small" effect="plain">
                    {{ area.inUse ? '使用中' : '可申请' }}
                  </el-tag>
                </div>
              </div>
              <el-tag v-else :type="venue.status === 'available' ? 'success' : 'warning'" effect="plain">
                {{ venue.status === 'available' ? '可申请' : '使用中' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 场地描述 -->
        <div class="info-card">
          <h2>场地描述</h2>
          <div class="venue-description">
            <p>{{ venueDescription }}</p>
          </div>
        </div>

        <!-- 使用须知 -->
        <div class="info-card">
          <h2>使用须知</h2>
          <ul class="notice-list">
            <li>请提前预约，按时到达场地</li>
            <li>请穿着运动服装和运动鞋，禁止穿皮鞋、高跟鞋入场</li>
            <li>请爱护场地设施，损坏需照价赔偿</li>
            <li>请保持场地清洁，禁止吸烟、饮食</li>
            <li>请遵守场地规则，服从管理人员安排</li>
            <li>如遇特殊情况需取消预约，请提前24小时通知</li>
          </ul>
        </div>
      </div>

      <!-- 右侧：申请表单 -->
      <div class="apply-form-section">
        <div class="form-card">
          <h2>场地申请</h2>
          <el-form
            ref="formRef"
            :model="applyForm"
            :rules="rules"
            label-width="100px"
            label-position="top"
          >
            <!-- 区域选择（如果有多个区域） -->
            <el-form-item v-if="venue.areas && venue.areas.length > 0" label="选择区域" prop="areaId">
              <el-select v-model="applyForm.areaId" placeholder="请选择场地区域" style="width: 100%">
                <el-option
                  v-for="area in venue.areas"
                  :key="area.id"
                  :label="`${area.name} (容纳${area.capacity}人) ${area.inUse ? '- 使用中' : ''}`"
                  :value="area.id"
                  :disabled="area.inUse"
                >
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>{{ area.name }} (容纳{{ area.capacity }}人)</span>
                    <el-tag
                      :type="area.inUse ? 'danger' : 'success'"
                      size="small"
                      style="margin-left: 10px"
                    >
                      {{ area.inUse ? '使用中' : '可申请' }}
                    </el-tag>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="使用日期" prop="date">
              <el-date-picker
                v-model="applyForm.date"
                type="date"
                placeholder="请选择使用日期"
                style="width: 100%"
                :disabled-date="disabledDate"
              />
            </el-form-item>

            <el-form-item label="使用时段" prop="timeRange">
              <el-time-picker
                v-model="applyForm.timeRange"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="HH:mm"
                value-format="HH:mm"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="关联活动" prop="activityId">
              <el-select v-model="applyForm.activityId" placeholder="请选择关联活动" style="width: 100%" @change="handleActivityChange">
                <el-option
                  v-for="activity in userActivities"
                  :key="activity.id"
                  :label="activity.name"
                  :value="activity.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="活动类型" prop="activityType">
              <el-select v-model="applyForm.activityType" placeholder="请选择活动类型" style="width: 100%" disabled>
                <el-option label="篮球" value="basketball" />
                <el-option label="羽毛球" value="badminton" />
                <el-option label="乒乓球" value="tabletennis" />
                <el-option label="足球" value="football" />
                <el-option label="网球" value="tennis" />
                <el-option label="排球" value="volleyball" />
                <el-option label="游泳" value="swimming" />
                <el-option label="健身" value="fitness" />
                <el-option label="跑步" value="running" />
                <el-option label="武术" value="martialarts" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>

            <el-form-item label="参与人数" prop="participants">
              <el-input-number
                v-model="applyForm.participants"
                :min="1"
                :max="venue.capacity"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="申请人姓名" prop="name">
              <el-input v-model="applyForm.name" placeholder="请输入您的姓名" />
            </el-form-item>

            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="applyForm.phone" placeholder="请输入联系电话" />
            </el-form-item>

            <el-form-item label="学号/工号" prop="studentId">
              <el-input v-model="applyForm.studentId" placeholder="请输入学号或工号" />
            </el-form-item>

            <el-form-item label="申请理由" prop="reason">
              <el-input
                v-model="applyForm.reason"
                type="textarea"
                :rows="4"
                placeholder="请简要说明申请理由"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                @click="handleSubmit"
              >
                提交申请
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 温馨提示 -->
          <el-alert
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
      <el-empty description="场地不存在或已被删除">
        <el-button type="primary" @click="goBack">返回场地列表</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Basketball, User } from '@element-plus/icons-vue'
import { venues } from '@/mock/venues'
import ImageCarousel from '@/components/image-carousel/index.vue'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)

// 模拟用户创建的活动列表
const userActivities = ref([
  { id: 1, name: '篮球友谊赛', type: 'basketball' },
  { id: 2, name: '羽毛球训练', type: 'badminton' },
  { id: 3, name: '足球比赛', type: 'football' },
  { id: 4, name: '网球练习', type: 'tennis' }
])

// 获取场地详情
const venue = ref(null)

onMounted(() => {
  const id = parseInt(route.params.id)
  venue.value = venues.find(item => item.id === id)
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
  return categoryMap[venue.value?.category] || '其他'
})

// 场地描述
const venueDescription = computed(() => {
  const descriptions = {
    basketball: '本场地为标准篮球场，配备专业篮球架和地板，灯光充足，适合进行篮球训练和比赛。场地定期维护，设施完善，为您提供最佳的运动体验。',
    football: '标准11人制足球场，草坪维护良好，配备专业球门和照明设施。适合进行足球训练、比赛和各类足球活动。',
    badminton: '专业羽毛球场地，配备标准球网和地板，灯光明亮均匀。场地宽敞，适合进行羽毛球训练和比赛。',
    tabletennis: '配备专业乒乓球台和地板，场地宽敞明亮。适合进行乒乓球训练和比赛，为您提供舒适的运动环境。',
    tennis: '标准网球场地，配备专业球网和地面，适合进行网球训练和比赛。场地维护良好，设施完善。',
    volleyball: '标准排球场地，配备专业球网和地板，适合进行排球训练和比赛。场地宽敞，设施齐全。',
    swimming: '标准游泳池，水质清洁，配备专业救生设备。适合进行游泳训练和休闲游泳，为您提供安全舒适的游泳环境。',
    fitness: '配备专业健身器材，包括有氧器械和力量训练设备。场地宽敞，通风良好，适合进行各类健身活动。',
    running: '标准400米跑道，地面平整，适合进行跑步训练和各类田径活动。场地开阔，环境优美。',
    martialarts: '专业武术训练场地，配备训练器材和防护设施。场地宽敞，适合进行各类武术训练和表演。',
    other: '多功能运动场地，适合进行各类体育活动。场地设施完善，为您提供良好的运动环境。'
  }
  return descriptions[venue.value?.category] || descriptions.other
})

// 申请表单
const applyForm = ref({
  areaId: '',
  date: '',
  timeRange: [],
  activityId: '',
  activityType: '',
  participants: 1,
  name: '',
  phone: '',
  studentId: '',
  reason: ''
})

const rules = {
  areaId: [{ required: true, message: '请选择场地区域', trigger: 'change' }],
  date: [{ required: true, message: '请选择使用日期', trigger: 'change' }],
  timeRange: [{ required: true, message: '请选择使用时段', trigger: 'change' }],
  activityId: [{ required: true, message: '请选择关联活动', trigger: 'change' }],
  activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  participants: [{ required: true, message: '请输入参与人数', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  studentId: [{ required: true, message: '请输入学号或工号', trigger: 'blur' }],
  reason: [{ required: true, message: '请填写申请理由', trigger: 'blur' }]
}

// 处理活动选择变化
const handleActivityChange = (value) => {
  // 选择活动时，自动填充活动类型
  const selectedActivity = userActivities.value.find(a => a.id === value)
  if (selectedActivity) {
    applyForm.value.activityType = selectedActivity.type
  }
}

// 禁用过去的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 获取活动名称
      const selectedActivity = userActivities.value.find(a => a.id === applyForm.value.activityId)
      const activityName = selectedActivity ? selectedActivity.name : ''
      
      // 格式化时间段
      const timeSlot = applyForm.value.timeRange ? 
        `${applyForm.value.timeRange[0]}-${applyForm.value.timeRange[1]}` : ''
      
      console.log('提交申请:', {
        ...applyForm.value,
        activityName,
        timeSlot
      })
      
      ElMessage.success('申请提交成功，请等待审核')
      // 这里后期对接API
      setTimeout(() => {
        router.push('/student/venue-apply')
      }, 1500)
    }
  })
}

const goBack = () => {
  router.push('/student/venue-apply')
}
</script>

<style lang="scss" scoped>
@use './styles/detail.scss';
</style>
