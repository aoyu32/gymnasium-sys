<template>
  <el-dialog
    :model-value="visible"
    title="申请场地"
    width="600px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="场地名称">
        <el-input :model-value="venue.name" disabled />
      </el-form-item>
      <el-form-item label="使用日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
          :disabled-date="disabledDate"
        />
      </el-form-item>
      <el-form-item label="使用时段" prop="timeRange">
        <el-time-picker
          v-model="form.timeRange"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="关联活动" prop="activityId">
        <el-select
          v-model="form.activityId"
          :placeholder="hasUserActivities ? '请选择关联活动' : '暂无可关联活动'"
          style="width: 100%"
          :loading="activityLoading"
          :disabled="activityLoading || !hasUserActivities"
          @change="handleActivityChange"
        >
          <el-option
            v-for="activity in userActivities"
            :key="activity.id"
            :label="activity.name"
            :value="activity.id"
          />
        </el-select>
        <div v-if="!activityLoading && !hasUserActivities" class="activity-empty-tip">
          <span>请先创建活动后再申请场地</span>
          <el-button link type="primary" @click="goToCreateActivity">去创建活动</el-button>
        </div>
      </el-form-item>
      <el-form-item label="活动类型" prop="activityType">
        <el-select v-model="form.activityType" placeholder="请选择" style="width: 100%" disabled>
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
        <el-input-number v-model="form.participants" :min="1" :max="100" style="width: 100%" />
      </el-form-item>
      <el-form-item label="申请理由" prop="reason">
        <el-input
          v-model="form.reason"
          type="textarea"
          :rows="4"
          placeholder="请简要说明场地使用目的"
        />
      </el-form-item>
      <el-form-item label="是否借用器材">
        <el-switch v-model="form.needEquipment" />
      </el-form-item>
      <el-form-item v-if="form.needEquipment" label="器材清单">
        <el-input
          v-model="form.equipmentList"
          type="textarea"
          :rows="3"
          placeholder="请列出需要借用的器材"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :disabled="activityLoading || !hasUserActivities" @click="handleSubmit">提交申请</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getMyActivities } from '@/api/activity'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  venue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const router = useRouter()
const formRef = ref(null)
const activityLoading = ref(false)

const userActivities = ref([])
const hasUserActivities = computed(() => userActivities.value.length > 0)

const form = ref({
  date: '',
  timeRange: [],
  activityId: '',
  activityType: '',
  participants: 1,
  reason: '',
  needEquipment: false,
  equipmentList: ''
})

const rules = {
  date: [{ required: true, message: '请选择使用日期', trigger: 'change' }],
  timeRange: [{ required: true, message: '请选择使用时段', trigger: 'change' }],
  activityId: [{ required: true, message: '请选择关联活动', trigger: 'change' }],
  activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  participants: [{ required: true, message: '请输入参与人数', trigger: 'blur' }],
  reason: [{ required: true, message: '请填写申请理由', trigger: 'blur' }]
}

const loadUserActivities = async () => {
  try {
    activityLoading.value = true
    const res = await getMyActivities({
      pageNum: 1,
      pageSize: 1000
    })
    const records = res.data?.records || []
    userActivities.value = records
      .filter(item => item?.id && item?.title && item.status !== 'cancelled')
      .map(item => ({
        id: item.id,
        name: item.title,
        type: item.category
      }))

    if (!userActivities.value.length) {
      ElMessage.warning('请先创建活动后再申请场地')
    }
  } catch (error) {
    console.error('加载关联活动失败:', error)
    ElMessage.error('加载关联活动失败')
  } finally {
    activityLoading.value = false
  }
}

// 处理活动选择变化
const handleActivityChange = (value) => {
  // 选择活动时，自动填充活动类型
  const selectedActivity = userActivities.value.find(a => a.id === value)
  form.value.activityType = selectedActivity ? selectedActivity.type : ''
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadUserActivities()
    return
  }

  if (!newVal) {
    // 关闭时重置表单
    form.value = {
      date: '',
      timeRange: [],
      activityId: '',
      activityType: '',
      participants: 1,
      reason: '',
      needEquipment: false,
      equipmentList: ''
    }
    formRef.value?.resetFields()
  }
})

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

const handleSubmit = async () => {
  if (!formRef.value) return
  if (!hasUserActivities.value) {
    ElMessage.warning('请先创建活动后再申请场地')
    return
  }
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 获取活动名称
      const selectedActivity = userActivities.value.find(a => a.id === form.value.activityId)
      const activityName = selectedActivity ? selectedActivity.name : ''
      
      // 格式化时间段
      const timeSlot = form.value.timeRange && form.value.timeRange.length === 2 ? 
        `${formatTime(form.value.timeRange[0])}-${formatTime(form.value.timeRange[1])}` : ''
      
      // 构建提交数据，匹配后端API格式
      const submitData = {
        venueId: props.venue.id,
        areaId: null, // 如果场地有区域，需要添加区域选择
        activityName: activityName,
        activityType: form.value.activityType,
        applyDate: formatDate(form.value.date),
        timeSlot: timeSlot,
        participants: form.value.participants,
        description: form.value.reason
      }
      
      emit('submit', submitData)
    }
  })
}

const goToCreateActivity = () => {
  emit('update:visible', false)
  router.push('/student/activities')
}

// 格式化日期为 YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化时间为 HH:mm
const formatTime = (time) => {
  if (!time) return ''
  const d = new Date(time)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style scoped>
.activity-empty-tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #909399;
}
</style>
