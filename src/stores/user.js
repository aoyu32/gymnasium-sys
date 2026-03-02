import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const role = ref(localStorage.getItem('role') || '')
  const userId = ref(localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')) : null)

  const setUserInfo = (info) => {
    userInfo.value = info
    if (info && info.userId) {
      userId.value = info.userId
      localStorage.setItem('userId', info.userId.toString())
    }
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setRole = (newRole) => {
    role.value = newRole
    localStorage.setItem('role', newRole)
  }

  const logout = () => {
    userInfo.value = null
    token.value = ''
    role.value = ''
    userId.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
  }

  return {
    userInfo,
    token,
    role,
    userId,
    setUserInfo,
    setToken,
    setRole,
    logout
  }
})
