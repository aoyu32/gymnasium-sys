<template>
  <div class="venue-filter">
    <div class="filter-left">
      <el-input
        v-model="localFilters.searchKeyword"
        placeholder="搜索场地名称"
        :prefix-icon="Search"
        clearable
        style="width: 300px"
        @input="handleFilterChange"
      />
      <el-select
        v-model="localFilters.category"
        placeholder="场地分类"
        clearable
        style="width: 200px"
        @change="handleFilterChange"
      >
        <el-option label="篮球场" value="basketball" />
        <el-option label="足球场" value="football" />
        <el-option label="羽毛球馆" value="badminton" />
        <el-option label="乒乓球室" value="tabletennis" />
        <el-option label="网球场" value="tennis" />
        <el-option label="排球馆" value="volleyball" />
        <el-option label="游泳馆" value="swimming" />
        <el-option label="健身房" value="fitness" />
        <el-option label="田径场" value="running" />
        <el-option label="武术馆" value="martialarts" />
        <el-option label="其他" value="other" />
      </el-select>
      <el-select
        v-model="localFilters.status"
        placeholder="场地状态"
        clearable
        style="width: 150px"
        @change="handleFilterChange"
      >
        <el-option label="可申请" value="available" />
        <el-option label="使用中" value="busy" />
      </el-select>
    </div>
    <el-button @click="handleReset">
      <el-icon><RefreshLeft /></el-icon>
      重置
    </el-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, RefreshLeft } from '@element-plus/icons-vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      searchKeyword: '',
      category: '',
      status: ''
    })
  }
})

const emit = defineEmits(['update:filters', 'reset'])

const localFilters = ref({ ...props.filters })

watch(() => props.filters, (newVal) => {
  localFilters.value = { ...newVal }
}, { deep: true })

const handleFilterChange = () => {
  emit('update:filters', localFilters.value)
}

const handleReset = () => {
  localFilters.value = {
    searchKeyword: '',
    category: '',
    status: ''
  }
  emit('update:filters', localFilters.value)
  emit('reset')
  ElMessage.info('已重置筛选条件')
}
</script>

<style lang="scss" scoped>
.venue-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.filter-left {
  display: flex;
  gap: 16px;
  flex: 1;
}

@media (max-width: 768px) {
  .venue-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-left {
    flex-direction: column;
  }
  
  .el-button {
    width: 100%;
  }
}
</style>
