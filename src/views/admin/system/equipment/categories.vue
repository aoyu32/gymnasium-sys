<template>
  <div class="system-equipment-categories">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>器材分类管理</span>
          <el-button type="primary" @click="handleAddCategory">
            <el-icon><Plus /></el-icon>
            添加分类
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索分类名称"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 分类列表 -->
      <el-table :data="paginatedCategories" stripe style="margin-top: 20px">
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column prop="count" label="器材数量" min-width="120" align="center">
          <template #default="{ row }">
            <span style="color: #1890ff; font-weight: 500;">{{ row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="300" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredCategories.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="categoryForm" :rules="categoryRules" ref="categoryFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="categoryForm.description" 
            type="textarea" 
            :rows="4" 
            placeholder="请输入分类描述" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEdit = ref(false)
const categoryFormRef = ref(null)

const categories = ref([
  { 
    id: 1, 
    name: '球类', 
    count: 150, 
    description: '各类球类器材，包括篮球、足球、排球、羽毛球等',
    createTime: '2020-09-01 10:00'
  },
  { 
    id: 2, 
    name: '球拍', 
    count: 80, 
    description: '各类球拍器材，包括羽毛球拍、网球拍、乒乓球拍等',
    createTime: '2020-09-01 10:30'
  },
  { 
    id: 3, 
    name: '护具', 
    count: 50, 
    description: '运动护具，包括护膝、护腕、头盔、护肘等',
    createTime: '2020-09-01 11:00'
  },
  { 
    id: 4, 
    name: '健身器材', 
    count: 30, 
    description: '健身相关器材，包括哑铃、跳绳、瑜伽垫、拉力器等',
    createTime: '2020-09-01 11:30'
  },
  { 
    id: 5, 
    name: '田径器材', 
    count: 25, 
    description: '田径运动器材，包括跑鞋、跨栏架、铅球、标枪等',
    createTime: '2021-03-15 09:00'
  }
])

const categoryForm = ref({
  name: '',
  description: ''
})

const categoryRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入分类描述', trigger: 'blur' }]
}

const dialogTitle = computed(() => isEdit.value ? '编辑分类' : '添加分类')

const filteredCategories = computed(() => {
  let result = [...categories.value]
  
  if (searchKeyword.value) {
    result = result.filter(c => c.name.includes(searchKeyword.value))
  }
  
  return result
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredCategories.value.slice(start, start + pageSize.value)
})

const handleAddCategory = () => {
  isEdit.value = false
  categoryForm.value = {
    name: '',
    description: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  categoryForm.value = { ...row }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!categoryFormRef.value) return
  
  await categoryFormRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const index = categories.value.findIndex(c => c.id === categoryForm.value.id)
        if (index !== -1) {
          categories.value[index] = { ...categoryForm.value }
        }
        ElMessage.success('分类更新成功')
      } else {
        const newCategory = {
          ...categoryForm.value,
          id: Date.now(),
          count: 0,
          createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
        }
        categories.value.unshift(newCategory)
        ElMessage.success('分类添加成功')
      }
      dialogVisible.value = false
    }
  })
}

const handleDelete = (row) => {
  if (row.count > 0) {
    ElMessage.warning('该分类下还有器材，无法删除')
    return
  }
  
  ElMessageBox.confirm('确定删除该分类吗？删除后将无法恢复。', '提示', {
    type: 'warning'
  }).then(() => {
    const index = categories.value.findIndex(c => c.id === row.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
@use './styles/categories.scss';
</style>
