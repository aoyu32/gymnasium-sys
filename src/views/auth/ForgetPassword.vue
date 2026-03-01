<template>
  <div class="forget-password-page">
    <div class="forget-card">
      <div class="forget-header">
        <el-icon :size="48" color="#f5222d"><Basketball /></el-icon>
        <h2>找回密码</h2>
        <p>通过邮箱找回密码</p>
      </div>

      <el-form ref="formRef" :model="forgetForm" :rules="rules" size="large">
        <el-form-item prop="email">
          <el-input
            v-model="forgetForm.email"
            placeholder="请输入邮箱"
            :prefix-icon="Message"
            clearable
          />
        </el-form-item>
        <el-form-item prop="code">
          <div style="display: flex; gap: 12px">
            <el-input
              v-model="forgetForm.code"
              placeholder="请输入验证码"
              :prefix-icon="Key"
              clearable
            />
            <el-button :disabled="countdown > 0" @click="sendCode">
              {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input
            v-model="forgetForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="forgetForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" :loading="loading" @click="handleReset">
            重置密码
          </el-button>
        </el-form-item>
        <el-form-item>
          <div class="login-link">
            <el-button link type="primary" @click="goToLogin">返回登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, Lock, Key, Basketball } from '@element-plus/icons-vue'
import { resetPassword, sendVerificationCode } from '@/api/auth'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const countdown = ref(0)

const forgetForm = ref({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== forgetForm.value.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validatePass, trigger: 'blur' }]
}

const sendCode = async () => {
  if (!forgetForm.value.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(forgetForm.value.email)) {
    ElMessage.warning('邮箱格式不正确')
    return
  }

  try {
    await sendVerificationCode(forgetForm.value.email)
    ElMessage.success('验证码已发送到邮箱')
    
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
  }
}

const handleReset = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await resetPassword(forgetForm.value)
        ElMessage.success('密码重置成功，请登录')
        router.push('/auth/login')
      } catch (error) {
        console.error('重置失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<style lang="scss" scoped>
@use './styles/ForgetPassword.scss';
</style>
