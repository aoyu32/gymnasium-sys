<template>
  <div class="system-managers">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>负责人管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加负责人
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索负责人姓名或工号"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="正常" value="active" />
          <el-option label="已禁用" value="disabled" />
        </el-select>
      </div>

      <!-- 负责人列表 -->
      <el-table :data="paginatedManagers" stripe style="margin-top: 20px">
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="managerId" label="工号" min-width="120" />
        <el-table-column prop="gender" label="性别" min-width="80" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
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
          :total="filteredManagers.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 添加/编辑负责人对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="managerForm" :rules="managerRules" ref="managerFormRef" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="managerForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="工号" prop="managerId">
          <el-input v-model="managerForm.managerId" placeholder="请输入工号" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="managerForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="managerForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="managerForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="初始密码" prop="password" v-if="!isEdit">
          <el-input v-model="managerForm.password" type="password" placeholder="请输入初始密码" show-password />
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
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEdit = ref(false)
const managerFormRef = ref(null)

const managers = ref([
  {
    id: 1,
    name: '刘老师',
    managerId: 'M001',
    gender: '男',
    phone: '13900139001',
    email: 'liu@example.com',
    createTime: '2020-09-01 10:00',
    status: 'active',
    statusText: '正常'
  },
  {
    id: 2,
    name: '陈老师',
    managerId: 'M002',
    gender: '女',
    phone: '13900139002',
    email: 'chen@example.com',
    createTime: '2020-09-01 11:00',
    status: 'active',
    statusText: '正常'
  },
  {
    id: 3,
    name: '王老师',
    managerId: 'M003',
    gender: '男',
    phone: '13900139003',
    email: 'wang@example.com',
    createTime: '2021-03-15 09:00',
    status: 'disabled',
    statusText: '已禁用'
  },
  {
    id: 4,
    name: '李老师',
    managerId: 'M004',
    gender: '女',
    phone: '13900139004',
    email: 'li@example.com',
    createTime: '2021-09-01 14:00',
    status: 'active',
    statusText: '正常'
  }
])

const managerForm = ref({
  name: '',
  managerId: '',
  gender: '男',
  phone: '',
  email: '',
  password: ''
})

const managerRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  managerId: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const dialogTitle = computed(() => isEdit.value ? '编辑负责人' : '添加负责人')

const filteredManagers = computed(() => {
  let result = [...managers.value]
  
  if (searchKeyword.value) {
    result = result.filter(m => 
      m.name.includes(searchKeyword.value) || 
      m.managerId.includes(searchKeyword.value)
    )
  }

  if (filterStatus.value) {
    result = result.filter(m => m.status === filterStatus.value)
  }
  
  return result
})

const paginatedManagers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredManagers.value.slice(start, start + pageSize.value)
})

const handleAdd = () => {
  isEdit.value = false
  managerForm.value = {
    name: '',
    managerId: '',
    gender: '男',
    phone: '',
    email: '',
    password: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  managerForm.value = { ...row }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!managerFormRef.value) return
  
  await managerFormRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const index = managers.value.findIndex(m => m.id === managerForm.value.id)
        if (index !== -1) {
          managers.value[index] = { ...managerForm.value }
        }
        ElMessage.success('负责人信息更新成功')
      } else {
        const newManager = {
          ...managerForm.value,
          id: Date.now(),
          createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
          status: 'active',
          statusText: '正常'
        }
        delete newManager.password
        managers.value.unshift(newManager)
        ElMessage.success('负责人添加成功')
      }
      dialogVisible.value = false
    }
  })
}

const handleToggleStatus = (row) => {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  const newStatusText = newStatus === 'active' ? '正常' : '已禁用'
  
  ElMessageBox.confirm(
    `确定${newStatus === 'active' ? '启用' : '禁用'}该负责人吗？`,
    '提示',
    { type: 'warning' }
  ).then(() => {
    row.status = newStatus
    row.statusText = newStatusText
    ElMessage.success(newStatus === 'active' ? '已启用' : '已禁用')
  }).catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该负责人吗？删除后将无法恢复。', '提示', {
    type: 'warning'
  }).then(() => {
    const index = managers.value.findIndex(m => m.id === row.id)
    if (index !== -1) {
      managers.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
