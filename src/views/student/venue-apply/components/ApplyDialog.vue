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
        <el-select v-model="form.activityId" placeholder="请选择关联活动" style="width: 100%" @change="handleActivityChange">
          <el-option
            v-for="activity in userActivities"
            :key="activity.id"
            :label="activity.name"
            :value="activity.id"
          />
        </el-select>
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
      <el-button type="primary" @click="handleSubmit">提交申请</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

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

const formRef = ref(null)

// 模拟用户创建的活动列表
const userActivities = ref([
  { id: 1, name: '篮球友谊赛', type: 'basketball' },
  { id: 2, name: '羽毛球训练', type: 'badminton' },
  { id: 3, name: '足球比赛', type: 'football' },
  { id: 4, name: '网球练习', type: 'tennis' }
])

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

// 处理活动选择变化
const handleActivityChange = (value) => {
  // 选择活动时，自动填充活动类型
  const selectedActivity = userActivities.value.find(a => a.id === value)
  if (selectedActivity) {
    form.value.activityType = selectedActivity.type
  }
}

watch(() => props.visible, (newVal) => {
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
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 获取活动名称
      const selectedActivity = userActivities.value.find(a => a.id === form.value.activityId)
      const activityName = selectedActivity ? selectedActivity.name : ''
      
      emit('submit', { 
        ...form.value, 
        venueName: props.venue.name,
        activityName
      })
      ElMessage.success('申请提交成功，等待审批')
      emit('update:visible', false)
    }
  })
}
</script>
