<template>
  <div class="activity-card">
    <div class="activity-image">
      <img :src="activity.image" :alt="activity.title" />
      <div class="activity-tag" :class="activity.status">{{ activity.statusText }}</div>
    </div>
    <div class="activity-info">
      <div class="activity-header">
        <h3>{{ activity.title }}</h3>
        <el-tag :type="getStatusTagType" size="small">{{ getStatusText }}</el-tag>
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
        <el-button type="primary" size="small" @click="handleViewDetail">查看详情</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock, Location, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
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
  ElMessage.info('查看活动详情功能开发中')
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
