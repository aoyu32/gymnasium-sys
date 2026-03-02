<template>
  <div class="activity-card">
    <div class="activity-image">
      <img :src="activity.image" :alt="activity.title" />
      <div class="activity-tag" :class="activity.status">{{ activity.statusText }}</div>
    </div>
    <div class="activity-info">
      <div class="activity-header">
        <h3>{{ activity.title }}</h3>
        <el-tag v-if="activity.isMyActivity && activity.approvalStatus !== 'approved'" :type="getApprovalTagType" size="small">
          {{ getApprovalStatusText }}
        </el-tag>
        <el-tag v-else :type="getStatusTagType" size="small">{{ getStatusText }}</el-tag>
      </div>
      <div class="activity-meta">
        <div class="meta-item">
          <el-icon><Clock /></el-icon>
          <span>{{ activity.time }}</span>
        </div>
        <div class="meta-item">
          <el-icon><Location /></el-icon>
          <span>{{ activity.venue }}</span>
        </div>
        <div class="meta-item">
          <el-icon><User /></el-icon>
          <span>{{ activity.participants }}/{{ activity.maxParticipants }}人</span>
        </div>
      </div>
      <div class="activity-footer">
        <el-tag :type="activity.activityType === 'public' ? 'info' : ''" size="small" effect="plain">
          {{ activity.activityType === 'public' ? '公共活动' : '私人活动' }}
        </el-tag>
        <div v-if="activity.isMyActivity" class="action-buttons">
          <el-button 
            type="warning" 
            size="small"
            :disabled="!canEdit"
            @click="handleEdit"
          >
            修改活动
          </el-button>
          <el-button 
            type="danger" 
            size="small"
            :disabled="!canCancel"
            @click="handleCancel"
          >
            取消活动
          </el-button>
        </div>
        <el-button 
          v-else
          type="primary" 
          size="small" 
          @click="handleViewDetail"
        >
          查看详情
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, Location, User } from '@element-plus/icons-vue'

const router = useRouter()

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'cancel'])

// 审核状态标签类型
const getApprovalTagType = computed(() => {
  switch (props.activity.approvalStatus) {
    case 'pending':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return 'info'
  }
})

// 审核状态文本
const getApprovalStatusText = computed(() => {
  switch (props.activity.approvalStatus) {
    case 'pending':
      return '待审核'
    case 'approved':
      return '已通过'
    case 'rejected':
      return '已拒绝'
    default:
      return '未知'
  }
})

// 是否可以编辑（只有进行中和已结束的活动不能编辑）
const canEdit = computed(() => {
  return props.activity.status === 'open'
})

// 是否可以取消（只有报名中且未取消的活动可以取消）
const canCancel = computed(() => {
  return props.activity.status === 'open'
})

// 根据参与人数判断活动状态
const getStatusTagType = computed(() => {
  const activityDate = new Date(props.activity.time)
  const now = new Date()
  
  // 判断是否已结束（活动时间已过）
  if (activityDate < now) {
    return 'info' // 已结束
  }
  
  // 判断是否已满员
  if (props.activity.participants >= props.activity.maxParticipants) {
    return 'warning' // 已满员
  }
  
  return 'success' // 报名中
})

const getStatusText = computed(() => {
  const activityDate = new Date(props.activity.time)
  const now = new Date()
  
  // 判断是否已结束
  if (activityDate < now) {
    return '已结束'
  }
  
  // 判断是否已满员
  if (props.activity.participants >= props.activity.maxParticipants) {
    return '已满员'
  }
  
  return '报名中'
})

const handleViewDetail = () => {
  router.push(`/student/activities/${props.activity.id}`)
}

const handleEdit = () => {
  emit('edit', props.activity)
}

const handleCancel = () => {
  emit('cancel', props.activity)
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
