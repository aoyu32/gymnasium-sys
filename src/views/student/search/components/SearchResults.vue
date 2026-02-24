<template>
  <div class="search-results">
    <!-- 活动结果 -->
    <div v-if="activities.length" class="result-section">
      <h3 class="section-title">活动 ({{ activities.length }})</h3>
      <div class="activity-grid">
        <ActivityCard
          v-for="activity in activities"
          :key="activity.id"
          :activity="activity"
          @click="$emit('view-activity', activity.id)"
        />
      </div>
    </div>

    <!-- 场地结果 -->
    <div v-if="venues.length" class="result-section">
      <h3 class="section-title">场地 ({{ venues.length }})</h3>
      <div class="venue-grid">
        <VenueCard
          v-for="venue in venues"
          :key="venue.id"
          :venue="venue"
          @click="$emit('view-venue', venue.id)"
        />
      </div>
    </div>

    <!-- 器材结果 -->
    <div v-if="equipments.length" class="result-section">
      <h3 class="section-title">器材 ({{ equipments.length }})</h3>
      <div class="equipment-grid">
        <EquipmentCard
          v-for="equipment in equipments"
          :key="equipment.id"
          :equipment="equipment"
          @click="$emit('view-equipment', equipment.id)"
        />
      </div>
    </div>

    <!-- 无结果 -->
    <el-empty v-if="!hasResults" description="未找到相关结果" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ActivityCard from '@/components/activity-card/index.vue'
import VenueCard from '@/components/venue-card/index.vue'
import EquipmentCard from '@/components/equipment-card/index.vue'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  venues: {
    type: Array,
    default: () => []
  },
  equipments: {
    type: Array,
    default: () => []
  }
})

defineEmits(['view-activity', 'view-venue', 'view-equipment'])

const hasResults = computed(() => {
  return props.activities.length > 0 ||
         props.venues.length > 0 ||
         props.equipments.length > 0
})
</script>

<style lang="scss" scoped>
.search-results {
  min-height: 600px;

  .result-section {
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 16px 0;
      padding-bottom: 12px;
      border-bottom: 2px solid #f5222d;
    }
  }

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

  .el-empty {
    padding: 120px 0;
  }
}

// 响应式设计
@media (max-width: 1400px) {
  .search-results {
    .activity-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

@media (max-width: 1200px) {
  .search-results {
    .activity-grid,
    .venue-grid,
    .equipment-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .search-results {
    .activity-grid,
    .venue-grid,
    .equipment-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
