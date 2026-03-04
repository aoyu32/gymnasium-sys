<template>
  <div class="equipment-filter">
    <div class="filter-left">
      <el-input
        v-model="localFilters.searchKeyword"
        placeholder="搜索器材名称"
        :prefix-icon="Search"
        clearable
        style="width: 300px"
        @input="handleFilterChange"
      />
      <el-select
        v-model="localFilters.category"
        placeholder="器材分类"
        clearable
        style="width: 150px"
        @change="handleFilterChange"
      >
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.name"
        />
      </el-select>
      <el-select
        v-model="localFilters.status"
        placeholder="库存状态"
        clearable
        style="width: 150px"
        @change="handleFilterChange"
      >
        <el-option label="有库存" value="available" />
        <el-option label="已借完" value="unavailable" />
      </el-select>
    </div>
    <div class="filter-right">
      <el-button @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getEquipmentCategories } from '@/api/equipment'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:filters', 'reset'])

const localFilters = ref({ ...props.filters })
const categories = ref([])

// 加载器材分类
const loadCategories = async () => {
  try {
    const res = await getEquipmentCategories()
    categories.value = res.data || []
  } catch (error) {
    console.error('加载器材分类失败:', error)
  }
}

onMounted(() => {
  loadCategories()
})

watch(() => props.filters, (newVal) => {
  localFilters.value = { ...newVal }
}, { deep: true })

const handleFilterChange = () => {
  emit('update:filters', localFilters.value)
}

const handleReset = () => {
  emit('reset')
}
</script>

<style lang="scss" scoped>
.equipment-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .filter-left {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .filter-right {
    display: flex;
    align-items: center;
  }
}
</style>
