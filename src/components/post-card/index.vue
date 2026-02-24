<template>
  <div class="post-card" @click="handleClick">
    <div class="post-avatar">
      <el-avatar :size="48" :src="post.avatar">
        <el-icon><User /></el-icon>
      </el-avatar>
    </div>
    <div class="post-content">
      <div class="post-header">
        <div class="header-left">
          <span class="author">{{ post.author }}</span>
          <span class="time">{{ formatDate(post.time) }}</span>
        </div>
        <el-tag size="small" type="info">{{ getCategoryLabel(post.category) }}</el-tag>
      </div>
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-summary">{{ post.summary }}</p>
      <div v-if="post.images?.length" class="post-images">
        <img
          v-for="(img, index) in post.images"
          :key="index"
          :src="img"
          alt="图片"
        />
      </div>
      <div class="post-footer">
        <div class="post-stats">
          <span><el-icon><View /></el-icon> {{ post.views }}</span>
          <span><el-icon><ChatDotRound /></el-icon> {{ post.comments }}</span>
          <span><el-icon><Star /></el-icon> {{ post.likes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, View, ChatDotRound, Star } from '@element-plus/icons-vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.post)
}

const getCategoryLabel = (category) => {
  const categoryMap = {
    'basketball': '篮球',
    'football': '足球',
    'badminton': '羽毛球',
    'tabletennis': '乒乓球',
    'tennis': '网球',
    'volleyball': '排球',
    'swimming': '游泳',
    'fitness': '健身',
    'running': '跑步',
    'other': '其他'
  }
  return categoryMap[category] || category
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
