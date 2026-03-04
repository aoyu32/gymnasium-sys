<template>
  <div class="venue-card">
    <div class="venue-image">
      <img :src="venueImage" :alt="venue.name" />
      <div class="venue-status" :class="venue.status">
        {{ venue.status === 'available' ? '可申请' : '使用中' }}
      </div>
    </div>
    <div class="venue-info">
      <h3>{{ venue.name }}</h3>
      <p class="venue-desc">{{ venue.description }}</p>
      <div class="venue-footer">
        <div class="meta-item">
          <el-icon><User /></el-icon>
          <span>容纳{{ venue.capacity }}人</span>
        </div>
        <el-button 
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
import { User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  venue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-detail'])

// 处理图片URL，支持单个URL或JSON数组
const venueImage = computed(() => {
  if (!props.venue.images) {
    return 'https://via.placeholder.com/400x300?text=No+Image'
  }
  
  // 如果是字符串，尝试解析为JSON
  if (typeof props.venue.images === 'string') {
    try {
      const images = JSON.parse(props.venue.images)
      return Array.isArray(images) && images.length > 0 ? images[0] : props.venue.images
    } catch {
      return props.venue.images
    }
  }
  
  // 如果是数组，取第一张图片
  if (Array.isArray(props.venue.images) && props.venue.images.length > 0) {
    return props.venue.images[0]
  }
  
  return 'https://via.placeholder.com/400x300?text=No+Image'
})

const handleViewDetail = () => {
  router.push(`/student/venue-apply/${props.venue.id}`)
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
