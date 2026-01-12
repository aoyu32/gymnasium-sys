<template>
  <div class="student-venue-apply">
    <div class="page-header">
      <h1>场地申请</h1>
      <p>选择合适的场地，提交使用申请</p>
    </div>

    <div class="content-wrapper">
      <!-- 场地列表 -->
      <div class="venue-list">
        <div class="section-title">选择场地</div>
        <div class="venue-grid">
          <div
            v-for="item in venues"
            :key="item.id"
            class="venue-card"
            :class="{ selected: selectedVenue?.id === item.id }"
            @click="selectVenue(item)"
          >
            <div class="venue-image">
              <img :src="item.image" :alt="item.name" />
              <div v-if="item.status === 'busy'" class="venue-status busy">使用中</div>
              <div v-else class="venue-status available">可用</div>
            </div>
            <div class="venue-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
              <div class="venue-meta">
                <span><el-icon><User /></el-icon> 容纳{{ item.capacity }}人</span>
                <span><el-icon><Money /></el-icon> {{ item.price }}元/小时</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 申请表单 -->
      <div class="apply-form">
        <div class="section-title">填写申请信息</div>
        <el-form
          ref="formRef"
          :model="applyForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="场地名称">
            <el-input v-model="selectedVenueName" disabled />
          </el-form-item>
          <el-form-item label="使用日期" prop="date">
            <el-date-picker
              v-model="applyForm.date"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              :disabled-date="disabledDate"
            />
          </el-form-item>
          <el-form-item label="使用时段" prop="timeRange">
            <el-time-picker
              v-model="applyForm.timeRange"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="活动类型" prop="activityType">
            <el-select v-model="applyForm.activityType" placeholder="请选择">
              <el-option label="篮球" value="basketball" />
              <el-option label="羽毛球" value="badminton" />
              <el-option label="乒乓球" value="tabletennis" />
              <el-option label="足球" value="football" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="参与人数" prop="participants">
            <el-input-number v-model="applyForm.participants" :min="1" :max="100" />
          </el-form-item>
          <el-form-item label="申请理由" prop="reason">
            <el-input
              v-model="applyForm.reason"
              type="textarea"
              :rows="4"
              placeholder="请简要说明场地使用目的"
            />
          </el-form-item>
          <el-form-item label="是否借用器材">
            <el-switch v-model="applyForm.needEquipment" />
          </el-form-item>
          <el-form-item v-if="applyForm.needEquipment" label="器材清单">
            <el-input
              v-model="applyForm.equipmentList"
              type="textarea"
              :rows="3"
              placeholder="请列出需要借用的器材"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交申请</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 我的申请记录 -->
    <div class="my-applications">
      <div class="section-title">我的申请记录</div>
      <el-table :data="applications" stripe>
        <el-table-column prop="venueName" label="场地名称" />
        <el-table-column prop="date" label="使用日期" />
        <el-table-column prop="time" label="使用时段" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small">查看详情</el-button>
            <el-button
              v-if="row.status === 'pending'"
              link
              type="danger"
              size="small"
            >
              取消申请
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Money } from '@element-plus/icons-vue'

const formRef = ref(null)
const selectedVenue = ref(null)

const venues = ref([
  {
    id: 1,
    name: '篮球馆A场',
    description: '标准篮球场，设施完善',
    capacity: 20,
    price: 50,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'
  },
  {
    id: 2,
    name: '羽毛球馆',
    description: '8片标准羽毛球场地',
    capacity: 16,
    price: 30,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400'
  },
  {
    id: 3,
    name: '足球场',
    description: '标准11人制足球场',
    capacity: 30,
    price: 100,
    status: 'busy',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400'
  }
])

const applyForm = ref({
  date: '',
  timeRange: [],
  activityType: '',
  participants: 1,
  reason: '',
  needEquipment: false,
  equipmentList: ''
})

const rules = {
  date: [{ required: true, message: '请选择使用日期', trigger: 'change' }],
  timeRange: [{ required: true, message: '请选择使用时段', trigger: 'change' }],
  activityType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  participants: [{ required: true, message: '请输入参与人数', trigger: 'blur' }],
  reason: [{ required: true, message: '请填写申请理由', trigger: 'blur' }]
}

const applications = ref([
  {
    id: 1,
    venueName: '篮球馆A场',
    date: '2026-01-18',
    time: '14:00-16:00',
    status: 'approved',
    statusText: '已通过'
  },
  {
    id: 2,
    venueName: '羽毛球馆',
    date: '2026-01-20',
    time: '09:00-11:00',
    status: 'pending',
    statusText: '待审批'
  }
])

const selectedVenueName = computed(() => {
  return selectedVenue.value?.name || '请先选择场地'
})

const selectVenue = (venue) => {
  if (venue.status === 'busy') {
    ElMessage.warning('该场地当前使用中，请选择其他场地')
    return
  }
  selectedVenue.value = venue
}

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

const handleSubmit = async () => {
  if (!selectedVenue.value) {
    ElMessage.warning('请先选择场地')
    return
  }
  
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('申请提交成功，等待审批')
      handleReset()
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
  selectedVenue.value = null
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
