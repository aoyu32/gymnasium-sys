<template>
  <div class="equipment-detail">
    <div v-if="equipment" class="detail-container">
      <!-- 左侧：器材信息 -->
      <div class="equipment-info-section">
        <!-- 器材封面 -->
        <div class="equipment-cover">
          <img :src="equipment.image" :alt="equipment.name" />
          <div class="cover-overlay">
            <div class="equipment-tag" :class="equipment.stock > 0 ? 'available' : 'unavailable'">
              {{ equipment.stock > 0 ? '可借' : '已借完' }}
            </div>
          </div>
        </div>

        <!-- 器材基本信息 -->
        <div class="info-card">
          <div class="card-header">
            <h1>{{ equipment.name }}</h1>
            <el-tag :type="equipment.stock > 0 ? 'success' : 'info'" size="large">
              {{ equipment.stock > 0 ? '可借' : '已借完' }}
            </el-tag>
          </div>

          <el-descriptions :column="1" border class="equipment-descriptions">
            <el-descriptions-item label="器材分类">
              <el-icon><Box /></el-icon>
              {{ getCategoryLabel }}
            </el-descriptions-item>
            <el-descriptions-item label="库存数量">
              <el-icon><Goods /></el-icon>
              {{ equipment.stock }}/{{ equipment.total }}件
            </el-descriptions-item>
            <el-descriptions-item label="入库日期">
              {{ equipment.createdAt }}
            </el-descriptions-item>
            <el-descriptions-item label="品牌规格">
              <div v-if="equipment.brands && equipment.brands.length > 0" class="brand-list">
                <div v-for="brand in equipment.brands" :key="brand.id" class="brand-item">
                  <div class="brand-info">
                    <span class="brand-name">{{ brand.name }}</span>
                    <span class="brand-model">{{ brand.model }}</span>
                  </div>
                  <div class="brand-stock">
                    <span>库存{{ brand.stock }}件</span>
                    <el-tag :type="brand.stock > 0 ? 'success' : 'info'" size="small" effect="plain">
                      {{ brand.stock > 0 ? '可借' : '已借完' }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <span v-else>无品牌信息</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 器材描述 -->
        <div class="info-card" v-if="equipment.description">
          <h2>器材描述</h2>
          <div class="equipment-description">
            <p>{{ equipment.description }}</p>
          </div>
        </div>

        <!-- 使用须知 -->
        <div class="info-card" v-if="equipment.notice">
          <h2>使用须知</h2>
          <ul class="notice-list">
            <li v-for="(item, index) in equipment.notice.split('\n')" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>

      <!-- 右侧：借用表单 -->
      <div class="borrow-form-section">
        <div class="form-card">
          <h2>借用申请</h2>
          <el-form
            ref="formRef"
            :model="borrowForm"
            :rules="rules"
            label-width="100px"
            label-position="top"
          >
            <!-- 品牌规格选择（如果有多个品牌） -->
            <el-form-item v-if="equipment.brands && equipment.brands.length > 0" label="选择品牌规格" prop="brandId">
              <el-select v-model="borrowForm.brandId" placeholder="请选择品牌规格" style="width: 100%" @change="handleBrandChange">
                <el-option
                  v-for="brand in equipment.brands"
                  :key="brand.id"
                  :label="`${brand.name} ${brand.model} (库存${brand.stock}件)`"
                  :value="brand.id"
                  :disabled="brand.stock === 0"
                >
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>{{ brand.name }} {{ brand.model }}</span>
                    <el-tag
                      :type="brand.stock > 0 ? 'success' : 'info'"
                      size="small"
                      style="margin-left: 10px"
                    >
                      库存{{ brand.stock }}件
                    </el-tag>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="借用数量" prop="quantity">
              <el-input-number
                v-model="borrowForm.quantity"
                :min="1"
                :max="maxQuantity"
                style="width: 100%"
              />
              <div class="form-tip">最多可借{{ maxQuantity }}件</div>
            </el-form-item>

            <el-form-item label="借用天数" prop="days">
              <el-input-number
                v-model="borrowForm.days"
                :min="1"
                :max="7"
                style="width: 100%"
              />
              <div class="form-tip">最长可借7天</div>
            </el-form-item>

            <el-form-item label="预计归还日期">
              <el-input :value="expectedReturnDate" disabled />
            </el-form-item>

            <el-form-item label="借用人姓名" prop="name">
              <el-input v-model="borrowForm.name" placeholder="请输入您的姓名" />
            </el-form-item>

            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="borrowForm.phone" placeholder="请输入联系电话" />
            </el-form-item>

            <el-form-item label="学号/工号" prop="studentId">
              <el-input v-model="borrowForm.studentId" placeholder="请输入学号或工号" />
            </el-form-item>

            <el-form-item label="借用理由" prop="reason">
              <el-input
                v-model="borrowForm.reason"
                type="textarea"
                :rows="4"
                placeholder="请简要说明借用目的"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :disabled="equipment.stock === 0"
                @click="handleSubmit"
              >
                {{ equipment.stock === 0 ? '暂无库存' : '提交申请' }}
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 温馨提示 -->
          <el-alert
            title="温馨提示"
            type="info"
            :closable="false"
            show-icon
          >
            <p>提交申请后，请等待审核通过。审核结果将通过短信或邮件通知您。</p>
          </el-alert>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <el-empty description="器材不存在或已被删除">
        <el-button type="primary" @click="goBack">返回器材列表</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Box, Goods } from '@element-plus/icons-vue'
import { getEquipmentById, createBorrowApplication } from '@/api/equipment'
import { getCurrentStudentInfo } from '@/api/student'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)

// 获取当前登录用户信息
const userInfo = computed(() => userStore.userInfo)

// 获取器材详情
const equipment = ref(null)
const loading = ref(false)

const loadEquipmentDetail = async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id)
    const res = await getEquipmentById(id)
    equipment.value = res.data
    
    // 加载完器材信息后，自动填充学生信息
    await fillStudentInfo()
  } catch (error) {
    console.error('加载器材详情失败:', error)
    ElMessage.error('加载器材详情失败')
  } finally {
    loading.value = false
  }
}

// 自动填充学生信息
const fillStudentInfo = async () => {
  try {
    // 先尝试从store获取基本信息
    if (userInfo.value) {
      borrowForm.value.name = userInfo.value.name || ''
    }
    
    // 调用API获取完整的学生信息
    const res = await getCurrentStudentInfo()
    if (res.data) {
      borrowForm.value.name = res.data.name || borrowForm.value.name
      borrowForm.value.phone = res.data.phone || ''
      borrowForm.value.studentId = res.data.studentId || ''
    }
  } catch (error) {
    console.error('获取学生信息失败:', error)
    // 如果获取失败，使用store中的基本信息
    if (userInfo.value) {
      borrowForm.value.name = userInfo.value.name || ''
    }
  }
}

onMounted(() => {
  loadEquipmentDetail()
})

// 分类标签映射
const categoryMap = {
  ball: '球类',
  racket: '球拍',
  protection: '护具',
  other: '其他'
}

const getCategoryLabel = computed(() => {
  return categoryMap[equipment.value?.category] || '其他'
})

// 借用表单
const borrowForm = ref({
  brandId: '',
  quantity: 1,
  days: 1,
  name: '',
  phone: '',
  studentId: '',
  reason: ''
})

// 最大可借数量
const maxQuantity = computed(() => {
  if (!equipment.value) return 1
  if (borrowForm.value.brandId) {
    const brand = equipment.value.brands?.find(b => b.id === borrowForm.value.brandId)
    return brand ? brand.stock : equipment.value.stock
  }
  return equipment.value.stock
})

// 预计归还日期
const expectedReturnDate = computed(() => {
  const today = new Date()
  const returnDate = new Date(today.getTime() + borrowForm.value.days * 24 * 60 * 60 * 1000)
  return returnDate.toISOString().split('T')[0]
})

const rules = {
  brandId: [{ required: true, message: '请选择品牌规格', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入借用数量', trigger: 'blur' }],
  days: [{ required: true, message: '请输入借用天数', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  studentId: [{ required: true, message: '请输入学号或工号', trigger: 'blur' }],
  reason: [{ required: true, message: '请填写借用理由', trigger: 'blur' }]
}

const handleBrandChange = () => {
  // 当品牌改变时，重置数量为1
  borrowForm.value.quantity = 1
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          equipmentId: equipment.value.id,
          brandId: borrowForm.value.brandId || null,
          quantity: borrowForm.value.quantity,
          days: borrowForm.value.days,
          name: borrowForm.value.name,
          phone: borrowForm.value.phone,
          studentId: borrowForm.value.studentId,
          reason: borrowForm.value.reason
        }
        await createBorrowApplication(data)
        ElMessage.success('借用申请提交成功，请等待审核')
        setTimeout(() => {
          router.push('/student/equipment')
        }, 1500)
      } catch (error) {
        console.error('提交借用申请失败:', error)
        ElMessage.error(error.message || '提交借用申请失败')
      }
    }
  })
}

const goBack = () => {
  router.push('/student/equipment')
}
</script>

<style lang="scss" scoped>
@use './styles/detail.scss';
</style>
