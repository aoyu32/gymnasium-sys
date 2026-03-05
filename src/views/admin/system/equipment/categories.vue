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
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <!-- 分类列表 -->
      <el-table :data="paginatedCategories" stripe style="margin-top: 20px" v-loading="loading">
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { 
  getCategoryList, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '@/api/admin/equipment-category'

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEdit = ref(false)
const categoryFormRef = ref(null)
const loading = ref(false)

const categories = ref([])

const categoryForm = ref({
  name: '',
  description: ''
})

const categoryRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入分类描述', trigger: 'blur' }]
}

const dialogTitle = computed(() => isEdit.value ? '编辑分类' : '添加分类')

const filteredCategories = computed(() => categories.value)

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredCategories.value.slice(start, start + pageSize.value)
})

// 加载器材分类列表
const loadCategories = async () => {
  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value
    }
    
    const res = await getCategoryList(params)
    if (res.code === 200) {
      categories.value = res.data
    }
  } catch (error) {
    console.error('加载器材分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadCategories()
}

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
  categoryForm.value = {
    id: row.id,
    name: row.name,
    description: row.description
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!categoryFormRef.value) return
  
  await categoryFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          name: categoryForm.value.name,
          description: categoryForm.value.description
        }
        
        if (isEdit.value) {
          const res = await updateCategory(categoryForm.value.id, data)
          if (res.code === 200) {
            ElMessage.success('分类更新成功')
            dialogVisible.value = false
            loadCategories()
          }
        } else {
          const res = await addCategory(data)
          if (res.code === 200) {
            ElMessage.success('分类添加成功')
            dialogVisible.value = false
            loadCategories()
          }
        }
      } catch (error) {
        console.error('保存器材分类失败:', error)
      }
    }
  })
}

const handleDelete = async (row) => {
  if (row.count > 0) {
    ElMessage.warning('该分类下还有器材，无法删除')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定删除该分类吗？删除后将无法恢复。', '提示', {
      type: 'warning'
    })
    
    const res = await deleteCategory(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadCategories()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除器材分类失败:', error)
    }
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style lang="scss" scoped>
@use './styles/categories.scss';
</style>
