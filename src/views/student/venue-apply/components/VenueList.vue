<template>
  <div class="venue-list">
    <div v-if="venues.length > 0" class="venue-grid">
      <VenueCard
        v-for="item in venues"
        :key="item.id"
        :venue="item"
        @apply="handleApply"
      />
    </div>
    <el-empty v-else description="暂无符合条件的场地">
      <el-button type="primary" @click="$emit('reset')">重置筛选条件</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import VenueCard from '@/components/venue-card/index.vue'

defineProps({
  venues: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['apply', 'reset'])

const handleApply = (venue) => {
  emit('apply', venue)
}
</script>

<style lang="scss" scoped>
.venue-list {
  min-height: 400px;
}

.venue-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .venue-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .venue-grid {
    grid-template-columns: 1fr;
  }
}
</style>
