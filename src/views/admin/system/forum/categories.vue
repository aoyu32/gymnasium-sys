<template>
  <div class="system-forum-categories">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>帖子分类管理</span>
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
        <el-table-column prop="postCount" label="帖子数量" min-width="120" align="center" />
        <el-table-column prop="description" label="描述" min-width="300" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" min-width="100" align="center" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="warning" size="small" @click="handleToggleStatus(row)">
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
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
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="categoryForm.sort" :min="0" :max="999" style="width: 100%" />
          <div class="form-tip">数字越小越靠前</div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="categoryForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
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
    name: '篮球', 
    postCount: 45, 
    description: '篮球相关的讨论、技巧分享、比赛交流等',
    sort: 1,
    status: 'active',
    statusText: '启用',
    createTime: '2020-09-01 10:00'
  },
  { 
    id: 2, 
    name: '足球', 
    postCount: 38, 
    description: '足球运动相关内容，包括技战术、球队组建等',
    sort: 2,
    status: 'active',
    statusText: '启用',
    createTime: '2020-09-01 10:30'
  },
  { 
    id: 3, 
    name: '羽毛球', 
    postCount: 52, 
    description: '羽毛球技巧、装备推荐、约球信息等',
    sort: 3,
    status: 'active',
    statusText: '启用',
    createTime: '2020-09-01 11:00'
  },
  { 
    id: 4, 
    name: '乒乓球', 
    postCount: 28, 
    description: '乒乓球运动交流、技术讨论',
    sort: 4,
    status: 'active',
    statusText: '启用',
    createTime: '2020-09-01 11:30'
  },
  { 
    id: 5, 
    name: '网球', 
    postCount: 22, 
    description: '网球运动相关话题',
    sort: 5,
    status: 'active',
    statusText: '启用',
    createTime: '2021-03-15 09:00'
  },
  { 
    id: 6, 
    name: '排球', 
    postCount: 18, 
    description: '排球技术、比赛组织等',
    sort: 6,
    status: 'active',
    statusText: '启用',
    createTime: '2021-03-15 09:30'
  },
  { 
    id: 7, 
    name: '游泳', 
    postCount: 35, 
    description: '游泳技巧、安全知识分享',
    sort: 7,
    status: 'active',
    statusText: '启用',
    createTime: '2021-03-15 10:00'
  },
  { 
    id: 8, 
    name: '健身', 
    postCount: 67, 
    description: '健身训练、营养搭配、器械使用等',
    sort: 8,
    status: 'active',
    statusText: '启用',
    createTime: '2021-03-15 10:30'
  },
  { 
    id: 9, 
    name: '跑步', 
    postCount: 41, 
    description: '跑步经验、路线推荐、装备分享',
    sort: 9,
    status: 'active',
    statusText: '启用',
    createTime: '2021-06-01 09:00'
  },
  { 
    id: 10, 
    name: '瑜伽', 
    postCount: 15, 
    description: '瑜伽练习、体式讲解',
    sort: 10,
    status: 'disabled',
    statusText: '禁用',
    createTime: '2021-06-01 09:30'
  },
  { 
    id: 11, 
    name: '其他', 
    postCount: 24, 
    description: '其他体育运动相关内容',
    sort: 99,
    status: 'active',
    statusText: '启用',
    createTime: '2020-09-01 12:00'
  }
])

const categoryForm = ref({
  name: '',
  description: '',
  sort: 0,
  status: 'active'
})

const categoryRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入分类描述', trigger: 'blur' }]
}

const dialogTitle = computed(() => isEdit.value ? '编辑分类' : '添加分类')

const filteredCategories = computed(() => {
  let result = [...categories.value]
  
  if (searchKeyword.value) {
    result = result.filter(c => c.name.includes(searchKeyword.value))
  }
  
  return result.sort((a, b) => a.sort - b.sort)
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredCategories.value.slice(start, start + pageSize.value)
})

const handleAddCategory = () => {
  isEdit.value = false
  categoryForm.value = {
    name: '',
    description: '',
    sort: 0,
    status: 'active'
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
          categories.value[index] = {
            ...categoryForm.value,
            statusText: categoryForm.value.status === 'active' ? '启用' : '禁用'
          }
        }
        ElMessage.success('分类更新成功')
      } else {
        const newCategory = {
          ...categoryForm.value,
          id: Date.now(),
          postCount: 0,
          statusText: categoryForm.value.status === 'active' ? '启用' : '禁用',
          createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
        }
        categories.value.push(newCategory)
        ElMessage.success('分类添加成功')
      }
      dialogVisible.value = false
    }
  })
}

const handleToggleStatus = (row) => {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  const newStatusText = newStatus === 'active' ? '启用' : '禁用'
  
  ElMessageBox.confirm(
    `确定${newStatus === 'active' ? '启用' : '禁用'}该分类吗？`,
    '提示',
    { type: 'warning' }
  ).then(() => {
    row.status = newStatus
    row.statusText = newStatusText
    ElMessage.success(newStatus === 'active' ? '已启用' : '已禁用')
  }).catch(() => {})
}

const handleDelete = (row) => {
  if (row.postCount > 0) {
    ElMessage.warning('该分类下还有帖子，无法删除')
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
