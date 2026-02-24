<template>
  <div class="result-list">
    <div v-if="items.length" :class="gridClass">
      <component
        :is="cardComponent"
        v-for="item in items"
        :key="item.id"
        v-bind="getCardProps(item)"
        @click="$emit('view-item', item.id)"
      />
    </div>
    <el-empty v-else :description="emptyText" />
    
    <el-pagination
      v-if="total > pageSize"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ActivityCard from '@/components/activity-card/index.vue'
import VenueCard from '@/components/venue-card/index.vue'
import EquipmentCard from '@/components/equipment-card/index.vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['activity', 'venue', 'equipment'].includes(value)
  },
  items: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 12
  },
  currentPage: {
    type: Number,
    default: 1
  },
  emptyText: {
    type: String,
    default: '未找到相关结果'
  }
})

const emit = defineEmits(['view-item', 'update:currentPage'])

const cardComponent = computed(() => {
  const componentMap = {
    activity: ActivityCard,
    venue: VenueCard,
    equipment: EquipmentCard
  }
  return componentMap[props.type]
})

const gridClass = computed(() => {
  const classMap = {
    activity: 'activity-grid',
    venue: 'venue-grid',
    equipment: 'equipment-grid'
  }
  return classMap[props.type]
})

const getCardProps = (item) => {
  const propsMap = {
    activity: { activity: item },
    venue: { venue: item },
    equipment: { equipment: item }
  }
  return propsMap[props.type]
}

const handlePageChange = (page) => {
  emit('update:currentPage', page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.result-list {
  .activity-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  .venue-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  .equipment-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }

  .el-empty {
    padding: 80px 0;
  }
}

// 响应式设计
@media (max-width: 1400px) {
  .result-list {
    .activity-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

@media (max-width: 1200px) {
  .result-list {
    .activity-grid,
    .venue-grid,
    .equipment-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .result-list {
    .activity-grid,
    .venue-grid,
    .equipment-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
