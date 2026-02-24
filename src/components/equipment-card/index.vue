<template>
  <div class="equipment-card">
    <div class="equipment-image">
      <img :src="equipment.image" :alt="equipment.name" />
      <div class="equipment-status" :class="equipment.stock > 0 ? 'available' : 'unavailable'">
        {{ equipment.stock > 0 ? '可借' : '已借完' }}
      </div>
    </div>
    <div class="equipment-info">
      <h3>{{ equipment.name }}</h3>
      <p class="equipment-desc">{{ equipment.description }}</p>
      <div class="equipment-meta">
        <div class="meta-item">
          <el-icon><Box /></el-icon>
          <span>库存 {{ equipment.stock }}/{{ equipment.total }}</span>
        </div>
        <div class="meta-item">
          <el-icon><CircleCheck /></el-icon>
          <span>{{ equipment.conditionText }}</span>
        </div>
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
</template>

<script setup>
import { Box, CircleCheck } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  equipment: {
    type: Object,
    required: true
  }
})

const handleViewDetail = () => {
  router.push(`/student/equipment/${props.equipment.id}`)
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
