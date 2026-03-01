<template>
  <div class="system-students">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>学生管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加学生
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索学生姓名或学号"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCollege" placeholder="学院" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="计算机学院" value="计算机学院" />
          <el-option label="软件学院" value="软件学院" />
          <el-option label="信息学院" value="信息学院" />
          <el-option label="体育学院" value="体育学院" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="正常" value="active" />
          <el-option label="已禁用" value="disabled" />
        </el-select>
      </div>

      <!-- 学生列表 -->
      <el-table :data="paginatedStudents" stripe style="margin-top: 20px">
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="studentId" label="学号" min-width="120" />
        <el-table-column prop="gender" label="性别" min-width="80" />
        <el-table-column prop="college" label="学院" min-width="150" show-overflow-tooltip />
        <el-table-column prop="major" label="专业" min-width="150" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column prop="registerTime" label="注册时间" min-width="160" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
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
          :total="filteredStudents.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="studentForm" :rules="studentRules" ref="studentFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="studentForm.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号" prop="studentId">
              <el-input v-model="studentForm.studentId" placeholder="请输入学号" :disabled="isEdit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="studentForm.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="studentForm.birthday"
                type="date"
                placeholder="请选择生日"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学院" prop="college">
              <el-select v-model="studentForm.college" placeholder="请选择学院" style="width: 100%">
                <el-option label="计算机学院" value="计算机学院" />
                <el-option label="软件学院" value="软件学院" />
                <el-option label="信息学院" value="信息学院" />
                <el-option label="体育学院" value="体育学院" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input v-model="studentForm.major" placeholder="请输入专业" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-input v-model="studentForm.grade" placeholder="如：2021级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级" prop="class">
              <el-input v-model="studentForm.class" placeholder="如：软件2101班" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="studentForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="studentForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="studentForm.qq" placeholder="请输入QQ号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯" prop="address">
              <el-input v-model="studentForm.address" placeholder="请输入籍贯" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 学生详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="学生详情"
      width="700px"
    >
      <div v-if="currentStudent" class="student-detail">
        <div class="detail-header">
          <el-avatar :size="100" class="detail-avatar">
            <el-icon :size="50"><User /></el-icon>
          </el-avatar>
          <div class="detail-info">
            <h2>{{ currentStudent.name }}</h2>
            <p class="student-id">{{ currentStudent.studentId }}</p>
          </div>
        </div>
        <el-descriptions :column="2" border class="detail-descriptions">
          <el-descriptions-item label="性别">{{ currentStudent.gender }}</el-descriptions-item>
          <el-descriptions-item label="生日">{{ currentStudent.birthday }}</el-descriptions-item>
          <el-descriptions-item label="学院">{{ currentStudent.college }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ currentStudent.major }}</el-descriptions-item>
          <el-descriptions-item label="年级">{{ currentStudent.grade }}</el-descriptions-item>
          <el-descriptions-item label="班级">{{ currentStudent.class }}</el-descriptions-item>
          <el-descriptions-item label="手机">{{ currentStudent.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentStudent.email }}</el-descriptions-item>
          <el-descriptions-item label="QQ">{{ currentStudent.qq }}</el-descriptions-item>
          <el-descriptions-item label="籍贯">{{ currentStudent.address }}</el-descriptions-item>
          <el-descriptions-item label="注册时间" :span="2">{{ currentStudent.registerTime }}</el-descriptions-item>
          <el-descriptions-item label="状态" :span="2">
            <el-tag :type="currentStudent.status === 'active' ? 'success' : 'danger'">
              {{ currentStudent.statusText }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleEditFromDetail">编辑</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, User } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const filterCollege = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const studentFormRef = ref(null)
const currentStudent = ref(null)

const students = ref([
  {
    id: 1,
    name: '张三',
    studentId: '2021001',
    gender: '男',
    birthday: '2003-05-15',
    college: '计算机学院',
    major: '软件工程',
    grade: '2021级',
    class: '软件2101班',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    qq: '123456789',
    address: '江苏省南京市',
    registerTime: '2021-09-01 10:00',
    status: 'active',
    statusText: '正常'
  },
  {
    id: 2,
    name: '李四',
    studentId: '2021002',
    gender: '女',
    birthday: '2003-08-20',
    college: '软件学院',
    major: '软件工程',
    grade: '2021级',
    class: '软件2102班',
    phone: '13800138002',
    email: 'lisi@example.com',
    qq: '234567890',
    address: '江苏省苏州市',
    registerTime: '2021-09-01 11:00',
    status: 'active',
    statusText: '正常'
  },
  {
    id: 3,
    name: '王五',
    studentId: '2021003',
    gender: '男',
    birthday: '2003-03-10',
    college: '信息学院',
    major: '信息管理',
    grade: '2021级',
    class: '信息2101班',
    phone: '13800138003',
    email: 'wangwu@example.com',
    qq: '345678901',
    address: '江苏省无锡市',
    registerTime: '2021-09-02 09:00',
    status: 'disabled',
    statusText: '已禁用'
  },
  {
    id: 4,
    name: '赵六',
    studentId: '2022001',
    gender: '女',
    birthday: '2004-06-25',
    college: '体育学院',
    major: '体育教育',
    grade: '2022级',
    class: '体育2201班',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    qq: '456789012',
    address: '江苏省常州市',
    registerTime: '2022-09-01 10:30',
    status: 'active',
    statusText: '正常'
  },
  {
    id: 5,
    name: '孙七',
    studentId: '2022002',
    gender: '男',
    birthday: '2004-11-08',
    college: '计算机学院',
    major: '计算机科学与技术',
    grade: '2022级',
    class: '计科2201班',
    phone: '13800138005',
    email: 'sunqi@example.com',
    qq: '567890123',
    address: '江苏省南京市',
    registerTime: '2022-09-01 14:00',
    status: 'active',
    statusText: '正常'
  }
])

const studentForm = ref({
  name: '',
  studentId: '',
  gender: '男',
  birthday: '',
  college: '',
  major: '',
  grade: '',
  class: '',
  phone: '',
  email: '',
  qq: '',
  address: ''
})

const studentRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
  college: [{ required: true, message: '请选择学院', trigger: 'change' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
  class: [{ required: true, message: '请输入班级', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const dialogTitle = computed(() => isEdit.value ? '编辑学生' : '添加学生')

const filteredStudents = computed(() => {
  let result = [...students.value]
  
  if (searchKeyword.value) {
    result = result.filter(s => 
      s.name.includes(searchKeyword.value) || 
      s.studentId.includes(searchKeyword.value)
    )
  }
  
  if (filterCollege.value) {
    result = result.filter(s => s.college === filterCollege.value)
  }

  if (filterStatus.value) {
    result = result.filter(s => s.status === filterStatus.value)
  }
  
  return result
})

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredStudents.value.slice(start, start + pageSize.value)
})

const handleAdd = () => {
  isEdit.value = false
  studentForm.value = {
    name: '',
    studentId: '',
    gender: '男',
    birthday: '',
    college: '',
    major: '',
    grade: '',
    class: '',
    phone: '',
    email: '',
    qq: '',
    address: ''
  }
  dialogVisible.value = true
}

const handleViewDetail = (row) => {
  currentStudent.value = row
  detailDialogVisible.value = true
}

const handleEditFromDetail = () => {
  detailDialogVisible.value = false
  handleEdit(currentStudent.value)
}

const handleEdit = (row) => {
  isEdit.value = true
  studentForm.value = { ...row }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!studentFormRef.value) return
  
  await studentFormRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const index = students.value.findIndex(s => s.id === studentForm.value.id)
        if (index !== -1) {
          students.value[index] = { ...studentForm.value }
        }
        ElMessage.success('学生信息更新成功')
      } else {
        const newStudent = {
          ...studentForm.value,
          id: Date.now(),
          registerTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
          status: 'active',
          statusText: '正常'
        }
        students.value.unshift(newStudent)
        ElMessage.success('学生添加成功')
      }
      dialogVisible.value = false
    }
  })
}

const handleToggleStatus = (row) => {
  const newStatus = row.status === 'active' ? 'disabled' : 'active'
  const newStatusText = newStatus === 'active' ? '正常' : '已禁用'
  
  ElMessageBox.confirm(
    `确定${newStatus === 'active' ? '启用' : '禁用'}该学生吗？`,
    '提示',
    { type: 'warning' }
  ).then(() => {
    row.status = newStatus
    row.statusText = newStatusText
    ElMessage.success(newStatus === 'active' ? '已启用' : '已禁用')
  }).catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该学生吗？删除后将无法恢复。', '提示', {
    type: 'warning'
  }).then(() => {
    const index = students.value.findIndex(s => s.id === row.id)
    if (index !== -1) {
      students.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
