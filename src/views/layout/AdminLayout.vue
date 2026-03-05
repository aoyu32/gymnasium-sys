<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="layout-aside">
        <div class="aside-header">
          <div class="header-content">
            <el-icon v-if="isCollapse" :size="24" :color="themeColor">
              <Basketball />
            </el-icon>
            <div v-else class="system-title">
              <el-icon :size="18" :color="themeColor">
                <Basketball />
              </el-icon>
              <span class="role-name" :style="{ color: themeColor }">{{ roleName }}</span><span class="suffix">后台</span>
            </div>
          </div>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :unique-opened="true"
          router
          :class="{ 'system-menu': isSystemAdmin }"
        >
          <template v-for="item in menuItems" :key="item.path">
            <!-- 有子菜单的项 -->
            <el-sub-menu v-if="item.children" :index="item.path">
              <template #title>
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :key="child.path"
                :index="child.path"
              >
                {{ child.title }}
              </el-menu-item>
            </el-sub-menu>
            <!-- 没有子菜单的项 -->
            <el-menu-item v-else :index="item.path">
              <el-icon><component :is="item.icon" /></el-icon>
              <template #title>{{ item.title }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 顶部栏 -->
        <el-header class="layout-header">
          <div class="header-left">
            <el-icon class="collapse-icon" :class="{ 'system-icon': isSystemAdmin }" @click="toggleCollapse">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: homeRoute }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <div class="user-info" :class="{ 'system-user': isSystemAdmin }">
                <el-avatar :size="36" :src="userInfo?.avatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="username">{{ userInfo?.name || userName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- 场地负责人显示完整菜单 -->
                  <template v-if="!isSystemAdmin">
                    <el-dropdown-item command="profile">
                      <el-icon><User /></el-icon>
                      个人信息
                    </el-dropdown-item>
                    <el-dropdown-item command="security">
                      <el-icon><Lock /></el-icon>
                      账号安全
                    </el-dropdown-item>
                    <el-dropdown-item divided command="logout">
                      <el-icon><SwitchButton /></el-icon>
                      退出登录
                    </el-dropdown-item>
                  </template>
                  <!-- 系统管理员只显示退出登录 -->
                  <template v-else>
                    <el-dropdown-item command="logout">
                      <el-icon><SwitchButton /></el-icon>
                      退出登录
                    </el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main class="layout-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>

    <!-- 个人信息对话框 -->
    <el-dialog
      v-model="profileDialogVisible"
      title="个人信息"
      width="600px"
    >
      <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="100px">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :class="{ 'system-uploader': isSystemAdmin }"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
          >
            <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：200x200，支持jpg、png格式</div>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="profileForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="工号" prop="employeeId">
          <el-input v-model="profileForm.employeeId" disabled />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="profileForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveProfile">保存</el-button>
      </template>
    </el-dialog>

    <!-- 账号安全对话框 -->
    <el-dialog
      v-model="securityDialogVisible"
      title="修改密码"
      width="500px"
    >
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="securityDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getCurrentManager, updateManager, changePassword as changeManagerPassword, updateAvatar } from '@/api/manager'
import { uploadImage } from '@/api/file'
import {
  Basketball,
  HomeFilled,
  Location,
  Calendar,
  Box,
  User,
  UserFilled,
  ChatDotRound,
  ArrowDown,
  SwitchButton,
  Fold,
  Expand,
  Lock,
  Plus
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)

const userInfo = computed(() => userStore.userInfo)
const activeMenu = computed(() => route.path)
const currentRoute = computed(() => route.meta?.title || '')

// 根据角色判断当前角色
const userRole = computed(() => {
  if (route.path.startsWith('/admin/manager')) {
    return 'manager'
  } else if (route.path.startsWith('/admin/system')) {
    return 'system'
  }
  return 'manager'
})

// 是否是系统管理员
const isSystemAdmin = computed(() => userRole.value === 'system')

// 主题色
const themeColor = computed(() => {
  return isSystemAdmin.value ? '#1890ff' : '#f5222d'
})

// 角色文本
const roleText = computed(() => {
  return userRole.value === 'manager' ? '场地负责人端' : '系统管理员端'
})

// 角色名称
const roleName = computed(() => {
  return userRole.value === 'manager' ? '场地负责人' : '系统管理员'
})

// 角色标签类型
const roleTagType = computed(() => {
  return userRole.value === 'manager' ? 'warning' : 'success'
})

// 根据角色显示不同的用户名
const userName = computed(() => {
  return userRole.value === 'manager' ? '场地负责人' : '系统管理员'
})

// 根据角色显示不同的首页路由
const homeRoute = computed(() => {
  return userRole.value === 'manager' ? '/admin/manager/home' : '/admin/system/home'
})

// 场地负责人菜单
const managerMenuItems = [
  { path: '/admin/manager/home', title: '工作台', icon: 'HomeFilled' },
  { 
    path: '/admin/manager/venues',
    title: '场地管理',
    icon: 'Location',
    children: [
      { path: '/admin/manager/venues/info', title: '场地信息管理' },
      { path: '/admin/manager/venues/applications', title: '场地申请管理' }
    ]
  },
  { 
    path: '/admin/manager/activities',
    title: '活动管理',
    icon: 'Calendar',
    children: [
      { path: '/admin/manager/activities/info', title: '活动信息管理' },
      { path: '/admin/manager/activities/applications', title: '活动申请管理' },
      { path: '/admin/manager/activities/my-activities', title: '我的活动管理' }
    ]
  },
  { 
    path: '/admin/manager/equipment',
    title: '器材管理',
    icon: 'Box',
    children: [
      { path: '/admin/manager/equipment/info', title: '器材信息管理' },
      { path: '/admin/manager/equipment/borrow', title: '器材借用管理' },
      { path: '/admin/manager/equipment/return', title: '器材归还管理' }
    ]
  }
]

// 系统管理员菜单
const systemMenuItems = [
  { path: '/admin/system/home', title: '数据看板', icon: 'HomeFilled' },
  { path: '/admin/system/students', title: '学生管理', icon: 'User' },
  { path: '/admin/system/managers', title: '负责人管理', icon: 'UserFilled' },
  { 
    path: '/admin/system/equipment',
    title: '器材管理',
    icon: 'Box',
    children: [
      { path: '/admin/system/equipment/categories', title: '器材分类管理' },
      { path: '/admin/system/equipment/applications', title: '器材申请管理' }
    ]
  },
  { 
    path: '/admin/system/forum',
    title: '论坛管理',
    icon: 'ChatDotRound',
    children: [
      { path: '/admin/system/forum/categories', title: '帖子分类管理' },
      { path: '/admin/system/forum/posts', title: '帖子信息管理' }
    ]
  }
]

// 根据角色返回对应的菜单
const menuItems = computed(() => {
  return userRole.value === 'manager' ? managerMenuItems : systemMenuItems
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 对话框控制
const profileDialogVisible = ref(false)
const securityDialogVisible = ref(false)
const profileFormRef = ref(null)
const passwordFormRef = ref(null)

// 个人信息表单
const profileForm = ref({
  avatar: '',
  name: '',
  employeeId: '',
  phone: '',
  email: ''
})

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 加载场地负责人信息
const loadManagerInfo = async () => {
  if (userRole.value !== 'manager') return
  
  try {
    const res = await getCurrentManager()
    if (res.code === 200) {
      profileForm.value = {
        avatar: res.data.avatar || '',
        name: res.data.name || '',
        employeeId: res.data.employeeId || '',
        phone: res.data.phone || '',
        email: res.data.email || ''
      }
      
      // 同步更新userStore中的用户信息
      const updatedUserInfo = {
        ...userStore.userInfo,
        name: res.data.name || '',
        avatar: res.data.avatar || ''
      }
      userStore.setUserInfo(updatedUserInfo)
    }
  } catch (error) {
    console.error('加载场地负责人信息失败:', error)
  }
}

// 表单验证规则
const profileRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      loadManagerInfo()
      profileDialogVisible.value = true
      break
    case 'security':
      securityDialogVisible.value = true
      passwordForm.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userStore.logout()
        router.push('/auth/login')
        ElMessage.success('已退出登录')
      }).catch(() => {})
      break
  }
}

// 保存个人信息
const handleSaveProfile = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          name: profileForm.value.name,
          phone: profileForm.value.phone,
          email: profileForm.value.email
        }
        
        const res = await updateManager(data)
        if (res.code === 200) {
          ElMessage.success('个人信息保存成功')
          profileDialogVisible.value = false
          // 更新userStore中的用户信息
          const updatedUserInfo = {
            ...userStore.userInfo,
            name: profileForm.value.name
          }
          userStore.setUserInfo(updatedUserInfo)
          loadManagerInfo()
        }
      } catch (error) {
        console.error('保存个人信息失败:', error)
      }
    }
  })
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          oldPassword: passwordForm.value.oldPassword,
          newPassword: passwordForm.value.newPassword
        }
        
        const res = await changeManagerPassword(data)
        if (res.code === 200) {
          ElMessage.success('密码修改成功，请重新登录')
          securityDialogVisible.value = false
          
          // 修改密码后自动退出登录
          setTimeout(() => {
            userStore.logout()
            router.push('/auth/login')
          }, 1500)
        }
      } catch (error) {
        console.error('修改密码失败:', error)
      }
    }
  })
}

// 头像上传前的校验
const beforeAvatarUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 自定义头像上传
const handleAvatarUpload = async (options) => {
  const { file } = options
  
  try {
    // 直接传递file对象，uploadImage函数会创建FormData
    const res = await uploadImage(file, 'avatars')
    if (res.code === 200) {
      const avatarUrl = res.data
      
      // 调用更新头像接口
      const updateRes = await updateAvatar(avatarUrl)
      if (updateRes.code === 200) {
        profileForm.value.avatar = avatarUrl
        // 更新userStore中的头像
        const updatedUserInfo = {
          ...userStore.userInfo,
          avatar: avatarUrl
        }
        userStore.setUserInfo(updatedUserInfo)
        ElMessage.success('头像上传成功')
      }
    }
  } catch (error) {
    console.error('上传头像失败:', error)
    ElMessage.error('上传头像失败')
  }
}

onMounted(() => {
  if (userRole.value === 'manager') {
    loadManagerInfo()
  }
})
</script>

<style lang="scss" scoped>
@use './styles/AdminLayout.scss';
</style>
