<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <el-icon :size="48" color="#f5222d"><Basketball /></el-icon>
        <h2>高校体育馆管理系统</h2>
        <p>欢迎登录</p>
      </div>

      <el-form ref="formRef" :model="loginForm" :rules="rules" size="large">
        <el-form-item prop="role">
          <el-select v-model="loginForm.role" placeholder="选择登录角色" style="width: 100%" clearable>
            <el-option label="学生" value="student" />
            <el-option label="场地负责人" value="manager" />
            <el-option label="系统管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="usernamePlaceholder"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <div class="login-options">
            <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
            <el-button link type="primary" @click="goToForget">忘记密码？</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <div class="register-link">
            还没有账号？
            <el-button link type="primary" @click="goToRegister">立即注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Basketball } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const loginForm = ref({
  username: '',
  password: '',
  role: 'student',
  remember: false
})

// 根据角色动态显示提示文本
const usernamePlaceholder = computed(() => {
  const placeholders = {
    student: '请输入学号/邮箱',
    manager: '请输入工号/邮箱',
    admin: '请输入用户名/邮箱'
  }
  return placeholders[loginForm.value.role] || '请输入账号'
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择登录角色', trigger: 'change' }]
}

const handleLogin = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await login({
          username: loginForm.value.username,
          password: loginForm.value.password,
          role: loginForm.value.role
        })
        
        // 设置用户信息
        userStore.setToken(res.data.token)
        userStore.setRole(res.data.role)
        userStore.setUserInfo({
          userId: res.data.userId,
          username: res.data.username,
          name: res.data.name,
          role: res.data.role
        })

        ElMessage.success('登录成功')

        // 根据角色跳转
        const roleRoutes = {
          student: '/student/home',
          manager: '/admin/manager/home',
          admin: '/admin/system/home'
        }
        router.push(roleRoutes[loginForm.value.role])
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

const goToRegister = () => {
  router.push('/auth/register')
}

const goToForget = () => {
  router.push('/auth/forget-password')
}
</script>

<style lang="scss" scoped>
@use './styles/Login.scss';
</style>
