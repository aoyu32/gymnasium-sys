<template>
  <div class="student-profile">
    <div class="page-header">
      <h1>个人中心</h1>
    </div>

    <div class="profile-content">
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="profile-card">
            <el-avatar :size="100" :src="userInfo.avatar">
              <el-icon :size="50"><User /></el-icon>
            </el-avatar>
            <h3>{{ userInfo.name }}</h3>
            <p>{{ userInfo.studentId }}</p>
            <el-button type="primary" @click="showEditDialog = true">编辑资料</el-button>
          </div>
        </el-col>

        <el-col :span="18">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="个人信息" name="info">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="姓名">{{ userInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="学号">{{ userInfo.studentId }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ userInfo.gender }}</el-descriptions-item>
                <el-descriptions-item label="年级">{{ userInfo.grade }}</el-descriptions-item>
                <el-descriptions-item label="学院">{{ userInfo.college }}</el-descriptions-item>
                <el-descriptions-item label="专业">{{ userInfo.major }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <el-tab-pane label="预约记录" name="bookings">
              <el-table :data="bookings" stripe>
                <el-table-column prop="activityName" label="活动名称" />
                <el-table-column prop="date" label="日期" />
                <el-table-column prop="time" label="时间" />
                <el-table-column prop="venue" label="场地" />
                <el-table-column prop="status" label="状态">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="借用记录" name="equipment">
              <el-table :data="equipmentRecords" stripe>
                <el-table-column prop="equipmentName" label="器材名称" />
                <el-table-column prop="quantity" label="数量" />
                <el-table-column prop="borrowDate" label="借用日期" />
                <el-table-column prop="returnDate" label="归还日期" />
                <el-table-column prop="status" label="状态">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog v-model="showEditDialog" title="编辑资料" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'

const activeTab = ref('info')
const showEditDialog = ref(false)

const userInfo = ref({
  name: '张三',
  studentId: '2021001',
  gender: '男',
  grade: '2021级',
  college: '计算机学院',
  major: '软件工程',
  phone: '138****8888',
  email: 'zhangsan@example.com',
  avatar: ''
})

const editForm = ref({ ...userInfo.value })

const bookings = ref([
  {
    activityName: '篮球友谊赛',
    date: '2026-01-18',
    time: '14:00-16:00',
    venue: '篮球馆A场',
    status: 'approved',
    statusText: '已通过'
  }
])

const equipmentRecords = ref([
  {
    equipmentName: '篮球',
    quantity: 2,
    borrowDate: '2026-01-10',
    returnDate: '2026-01-17',
    status: 'borrowed',
    statusText: '借用中'
  }
])

const handleSave = () => {
  Object.assign(userInfo.value, editForm.value)
  showEditDialog.value = false
  ElMessage.success('保存成功')
}

const getStatusType = (status) => {
  const typeMap = {
    approved: 'success',
    pending: 'warning',
    borrowed: 'warning',
    returned: 'success'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
