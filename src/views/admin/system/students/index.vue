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
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCollege" placeholder="学院" clearable style="width: 150px" @change="handleSearch">
          <el-option label="全部" value="" />
          <el-option label="计算机学院" value="计算机学院" />
          <el-option label="软件学院" value="软件学院" />
          <el-option label="信息学院" value="信息学院" />
          <el-option label="体育学院" value="体育学院" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 120px" @change="handleSearch">
          <el-option label="全部" value="" />
          <el-option label="正常" value="active" />
          <el-option label="已禁用" value="disabled" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <!-- 学生列表 -->
      <el-table :data="paginatedStudents" stripe style="margin-top: 20px" v-loading="loading">
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
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadStudents"
          @current-change="loadStudents"
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
          <el-descriptions-item label="班级">{{ currentStudent.classInfo }}</el-descriptions-item>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, User } from '@element-plus/icons-vue'
import { 
  getStudentList, 
  getStudentDetail, 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  toggleStudentStatus 
} from '@/api/admin/student'

const searchKeyword = ref('')
const filterCollege = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isEdit = ref(false)
const studentFormRef = ref(null)
const currentStudent = ref(null)
const loading = ref(false)

const students = ref([])

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

const paginatedStudents = computed(() => students.value)

// 加载学生列表
const loadStudents = async () => {
  loading.value = true
  try {
    const params = {
      keyword: searchKeyword.value,
      college: filterCollege.value,
      status: filterStatus.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    
    const res = await getStudentList(params)
    if (res.code === 200) {
      students.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    console.error('加载学生列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索和筛选变化时重新加载
const handleSearch = () => {
  currentPage.value = 1
  loadStudents()
}

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

const handleViewDetail = async (row) => {
  try {
    const res = await getStudentDetail(row.id)
    if (res.code === 200) {
      currentStudent.value = res.data
      detailDialogVisible.value = true
    }
  } catch (error) {
    console.error('加载学生详情失败:', error)
  }
}

const handleEditFromDetail = () => {
  detailDialogVisible.value = false
  handleEdit(currentStudent.value)
}

const handleEdit = (row) => {
  isEdit.value = true
  studentForm.value = {
    id: row.id,
    name: row.name,
    studentId: row.studentId,
    gender: row.gender,
    birthday: row.birthday,
    college: row.college,
    major: row.major,
    grade: row.grade,
    class: row.classInfo,
    phone: row.phone,
    email: row.email,
    qq: row.qq || '',
    address: row.address || ''
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!studentFormRef.value) return
  
  await studentFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          studentId: studentForm.value.studentId,
          name: studentForm.value.name,
          gender: studentForm.value.gender,
          birthday: studentForm.value.birthday,
          college: studentForm.value.college,
          major: studentForm.value.major,
          grade: studentForm.value.grade,
          classInfo: studentForm.value.class,
          phone: studentForm.value.phone,
          email: studentForm.value.email,
          qq: studentForm.value.qq,
          address: studentForm.value.address
        }
        
        if (isEdit.value) {
          const res = await updateStudent(studentForm.value.id, data)
          if (res.code === 200) {
            ElMessage.success('学生信息更新成功')
            dialogVisible.value = false
            loadStudents()
          }
        } else {
          const res = await addStudent(data)
          if (res.code === 200) {
            ElMessage.success('学生添加成功，默认密码为123456')
            dialogVisible.value = false
            loadStudents()
          }
        }
      } catch (error) {
        console.error('保存学生信息失败:', error)
      }
    }
  })
}

const handleToggleStatus = async (row) => {
  const newStatusText = row.status === 'active' ? '禁用' : '启用'
  
  try {
    await ElMessageBox.confirm(
      `确定${newStatusText}该学生吗？`,
      '提示',
      { type: 'warning' }
    )
    
    const res = await toggleStudentStatus(row.id)
    if (res.code === 200) {
      ElMessage.success(`已${newStatusText}`)
      loadStudents()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('切换状态失败:', error)
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该学生吗？删除后将无法恢复。', '提示', {
      type: 'warning'
    })
    
    const res = await deleteStudent(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadStudents()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除学生失败:', error)
    }
  }
}

onMounted(() => {
  loadStudents()
})
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
