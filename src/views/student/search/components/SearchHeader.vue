<template>
  <div class="search-header">
    <el-input
      v-model="keyword"
      placeholder="搜索活动、场地、器材..."
      size="large"
      clearable
      @keyup.enter="handleSearch"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
      <template #append>
        <el-button @click="handleSearch">搜索</el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const keyword = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  keyword.value = newVal
})

watch(keyword, (newVal) => {
  emit('update:modelValue', newVal)
})

const handleSearch = () => {
  emit('search', keyword.value)
}
</script>

<style lang="scss" scoped>
.search-header {
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-input {
    width: 700px;

    :deep(.el-input__wrapper) {
      box-shadow: none;
      border: 1px solid #dcdfe6;
      padding: 0 20px;
      border-radius: 24px 0 0 24px;
      height: 45px;
      transition: all 0.3s ease;

      &:hover {
        border-color: #c0c4cc;
      }

      &.is-focus {
        border-color: #f5222d;
        box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.1);
      }
    }

    :deep(.el-input__inner) {
      font-size: 15px;
      height: 43px;
      line-height: 43px;
    }

    :deep(.el-input__prefix) {
      display: flex;
      align-items: center;
      height: 43px;
    }

    :deep(.el-input-group__append) {
      background-color: #f5222d;
      border: none;
      box-shadow: none;
      padding: 0 28px;
      border-radius: 0 24px 24px 0;
      margin-left: -1px;

      .el-button {
        background-color: transparent;
        border: none;
        color: white;
        font-weight: 500;
        font-size: 15px;
        height: 43px;
        padding: 0;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    :deep(.el-icon) {
      color: #909399;
      font-size: 16px;
    }
  }
}
</style>
