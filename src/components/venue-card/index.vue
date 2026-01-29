<template>
  <div class="venue-card">
    <div class="venue-image">
      <img :src="venue.image" :alt="venue.name" />
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
          :disabled="venue.status === 'busy'"
          @click="handleApply"
        >
          {{ venue.status === 'available' ? '立即申请' : '使用中' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  venue: {
    type: Object,
    required: true
  }
})

const handleApply = () => {
  router.push('/student/venue-apply')
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
