<template>
  <div class="equipment-list">
    <div v-if="equipments.length > 0" class="equipment-grid">
      <EquipmentCard
        v-for="equipment in equipments"
        :key="equipment.id"
        :equipment="equipment"
      />
    </div>
    <el-empty v-else description="暂无器材" />
  </div>
</template>

<script setup>
import EquipmentCard from '@/components/equipment-card/index.vue'

defineProps({
  equipments: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.equipment-list {
  .equipment-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 1200px) {
  .equipment-list .equipment-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .equipment-list .equipment-grid {
    grid-template-columns: 1fr;
  }
}
</style>
