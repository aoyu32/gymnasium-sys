<template>
  <div class="activity-info-management">
    <el-card>
      <template #header>
        <div class="header">
          <span>活动信息管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加活动
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索活动名称"
          clearable
          style="width: 300px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCategory" placeholder="活动分类" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="篮球" value="basketball" />
          <el-option label="足球" value="football" />
          <el-option label="羽毛球" value="badminton" />
          <el-option label="乒乓球" value="tabletennis" />
          <el-option label="网球" value="tennis" />
          <el-option label="排球" value="volleyball" />
          <el-option label="游泳" value="swimming" />
          <el-option label="健身" value="fitness" />
          <el-option label="跑步" value="running" />
          <el-option label="武术" value="martialarts" />
          <el-option label="其他" value="other" />
        </el-select>
        <el-select v-model="filterType" placeholder="活动类型" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="公共活动" value="public" />
          <el-option label="私人活动" value="private" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="活动状态" clearable style="width: 150px; margin-left: 12px">
          <el-option label="全部" value="" />
          <el-option label="报名中" value="ongoing" />
          <el-option label="已满员" value="full" />
          <el-option label="已结束" value="ended" />
        </el-select>
      </div>

      <!-- 活动列表 -->
      <el-table :data="paginatedActivities" stripe style="margin-top: 20px">
        <el-table-column prop="image" label="活动封面" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="活动名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="category" label="活动分类" width="100">
          <template #default="{ row }">
            {{ getCategoryLabel(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="activityType" label="活动类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.activityType === 'public' ? 'info' : ''" size="small">
              {{ row.activityType === 'public' ? '公共活动' : '私人活动' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" width="100">
          <template #default="{ row }">
            {{ row.creator }}
          </template>
        </el-table-column>
        <el-table-column prop="time" label="活动时间" width="160" />
        <el-table-column prop="venue" label="活动地点" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.venue }}{{ row.area ? ` - ${row.area}` : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="participants" label="参与人数" width="110">
          <template #default="{ row }">
            {{ row.participants }}/{{ row.maxParticipants }}人
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getActivityStatusType(row)" size="small">
              {{ getActivityStatusText(row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <div style="display: flex; gap: 8px; flex-wrap: nowrap; white-space: nowrap;">
              <el-button link type="primary" size="small" @click="handleViewDetail(row)">查看详情</el-button>
              <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="filteredActivities.length"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动名称" prop="title">
              <el-input v-model="formData.title" placeholder="请输入活动名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动分类" prop="category">
              <el-select v-model="formData.category" placeholder="请选择活动分类" style="width: 100%">
                <el-option label="篮球" value="basketball" />
                <el-option label="足球" value="football" />
                <el-option label="羽毛球" value="badminton" />
                <el-option label="乒乓球" value="tabletennis" />
                <el-option label="网球" value="tennis" />
                <el-option label="排球" value="volleyball" />
                <el-option label="游泳" value="swimming" />
                <el-option label="健身" value="fitness" />
                <el-option label="跑步" value="running" />
                <el-option label="武术" value="martialarts" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动时间" prop="time">
              <el-date-picker
                v-model="formData.time"
                type="datetime"
                placeholder="选择活动时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场地" prop="venue">
              <el-input v-model="formData.venue" placeholder="请输入场地名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="区域" prop="area">
              <el-input v-model="formData.area" placeholder="请输入区域名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大人数" prop="maxParticipants">
              <el-input-number v-model="formData.maxParticipants" :min="1" :max="1000" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动类型" prop="activityType">
              <el-radio-group v-model="formData.activityType">
                <el-radio label="public">公共活动</el-radio>
                <el-radio label="private">私人活动</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动封面" prop="image">
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :http-request="handleImageUpload"
          >
            <img v-if="formData.image" :src="formData.image" class="uploaded-image" />
            <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：400x300，支持jpg、png格式</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="活动详情"
      width="800px"
    >
      <div class="activity-detail" v-if="currentActivity">
        <!-- 活动封面 -->
        <div class="detail-section">
          <el-image
            :src="currentActivity.image"
            fit="cover"
            style="width: 100%; height: 300px; border-radius: 8px"
            :preview-src-list="[currentActivity.image]"
          />
        </div>

        <!-- 基本信息 -->
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动名称：</span>
                <span class="value">{{ currentActivity.title }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动分类：</span>
                <span class="value">{{ getCategoryLabel(currentActivity.category) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动时间：</span>
                <span class="value">{{ currentActivity.time }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动地点：</span>
                <span class="value">{{ currentActivity.venue }}{{ currentActivity.area ? ` - ${currentActivity.area}` : '' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">参与人数：</span>
                <span class="value">{{ currentActivity.participants }}/{{ currentActivity.maxParticipants }}人</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动类型：</span>
                <el-tag :type="currentActivity.activityType === 'public' ? 'info' : ''" size="small">
                  {{ currentActivity.activityType === 'public' ? '公共活动' : '私人活动' }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">创建人：</span>
                <span class="value">{{ currentActivity.creator }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <span class="label">活动状态：</span>
                <el-tag :type="getActivityStatusType(currentActivity)" size="small">
                  {{ getActivityStatusText(currentActivity) }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 活动详情 -->
        <div class="detail-section" v-if="getActivityDescription(currentActivity)">
          <h3 class="section-title">活动详情</h3>
          <p class="description-text">{{ getActivityDescription(currentActivity) }}</p>
        </div>

        <!-- 活动须知 -->
        <div class="detail-section">
          <h3 class="section-title">活动须知</h3>
          <ul class="notice-list">
            <li>请提前15分钟到达活动场地</li>
            <li>请穿着运动服装和运动鞋</li>
            <li>请自备水杯，注意补充水分</li>
            <li>如有身体不适，请及时告知组织者</li>
            <li>请遵守场地规则，爱护公共设施</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { activities } from '@/mock/activities'

const searchKeyword = ref('')
const filterCategory = ref('')
const filterType = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('添加活动')
const formRef = ref(null)
const editingId = ref(null)
const currentActivity = ref(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

const formData = ref({
  title: '',
  category: '',
  time: '',
  venue: '',
  area: '',
  maxParticipants: 10,
  activityType: 'public',
  image: '',
  participants: 0
})

const rules = {
  title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择活动分类', trigger: 'change' }],
  time: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  venue: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  maxParticipants: [{ required: true, message: '请输入最大人数', trigger: 'blur' }],
  image: [{ required: true, message: '请输入活动封面URL', trigger: 'blur' }]
}

const activitiesList = ref([...activities])

const filteredActivities = computed(() => {
  return activitiesList.value.filter(activity => {
    const matchKeyword = !searchKeyword.value || activity.title.includes(searchKeyword.value)
    const matchCategory = !filterCategory.value || activity.category === filterCategory.value
    const matchType = !filterType.value || activity.activityType === filterType.value
    
    let matchStatus = true
    if (filterStatus.value) {
      const status = getActivityStatus(activity)
      matchStatus = status === filterStatus.value
    }
    
    return matchKeyword && matchCategory && matchType && matchStatus
  })
})

// 分页后的数据
const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredActivities.value.slice(start, end)
})

const categoryMap = {
  basketball: '篮球',
  football: '足球',
  badminton: '羽毛球',
  tabletennis: '乒乓球',
  tennis: '网球',
  volleyball: '排球',
  swimming: '游泳',
  fitness: '健身',
  running: '跑步',
  martialarts: '武术',
  other: '其他'
}

const getCategoryLabel = (category) => {
  return categoryMap[category] || '其他'
}

const getActivityStatus = (activity) => {
  const activityDate = new Date(activity.time)
  const now = new Date()
  
  if (activityDate < now) return 'ended'
  if (activity.participants >= activity.maxParticipants) return 'full'
  return 'ongoing'
}

const getActivityStatusType = (activity) => {
  const status = getActivityStatus(activity)
  const typeMap = {
    ongoing: 'success',
    full: 'warning',
    ended: 'info'
  }
  return typeMap[status] || 'info'
}

const getActivityStatusText = (activity) => {
  const status = getActivityStatus(activity)
  const textMap = {
    ongoing: '报名中',
    full: '已满员',
    ended: '已结束'
  }
  return textMap[status] || ''
}

const getActivityDescription = (activity) => {
  const descriptions = {
    basketball: '本次篮球活动旨在促进同学们之间的交流与合作，提高篮球技能。无论你是篮球高手还是初学者，都欢迎参加。我们将进行友谊赛和技巧训练，让每个人都能享受篮球的乐趣。',
    football: '足球是一项充满激情的运动，本次活动将组织友谊赛和基础训练。欢迎所有热爱足球的同学参加，一起在绿茵场上挥洒汗水，感受团队合作的魅力。',
    badminton: '羽毛球是一项老少皆宜的运动，本次活动将提供专业教练指导，帮助大家提高技术水平。无论是单打还是双打，都能找到适合自己的训练方式。',
    tabletennis: '乒乓球作为国球，深受大家喜爱。本次活动将举办比赛和训练，让大家在切磋中提高球技，在交流中增进友谊。',
    tennis: '网球是一项优雅的运动，本次活动将提供专业场地和器材，欢迎网球爱好者参加。我们将进行技术指导和友谊赛，让大家享受网球的乐趣。',
    volleyball: '排球是一项团队运动，强调配合与默契。本次活动将组织训练和比赛，让大家在运动中增强体质，培养团队精神。',
    swimming: '游泳是一项全身运动，对身体健康非常有益。本次活动将提供专业教练指导，帮助大家掌握正确的游泳技巧，提高游泳水平。',
    fitness: '健身活动将提供专业的器械和指导，帮助大家科学锻炼，塑造健康体魄。无论是增肌还是减脂，都能找到适合自己的训练方案。',
    running: '跑步是最简单有效的运动方式，本次活动将组织集体晨跑，让大家在清晨的阳光下开启活力的一天，享受运动的快乐。',
    martialarts: '武术是中华传统文化的瑰宝，本次活动将教授基本功和套路，让大家感受武术的魅力，强身健体，修身养性。',
    other: '本次活动将为大家提供一个交流和锻炼的平台，欢迎所有热爱运动的同学参加，一起享受运动的乐趣。'
  }
  return descriptions[activity.category] || descriptions.other
}

const handleAdd = () => {
  dialogTitle.value = '添加活动'
  editingId.value = null
  formData.value = {
    title: '',
    category: '',
    time: '',
    venue: '',
    area: '',
    maxParticipants: 10,
    activityType: 'public',
    image: '',
    participants: 0
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑活动'
  editingId.value = row.id
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (editingId.value) {
        // 编辑
        const index = activitiesList.value.findIndex(v => v.id === editingId.value)
        if (index !== -1) {
          activitiesList.value[index] = { ...formData.value, id: editingId.value }
        }
        ElMessage.success('活动信息更新成功')
      } else {
        // 添加
        const newActivity = {
          ...formData.value,
          id: Date.now(),
          status: 'new',
          statusText: '最新'
        }
        activitiesList.value.push(newActivity)
        ElMessage.success('活动添加成功')
      }
      dialogVisible.value = false
    }
  })
}

const handleViewDetail = (row) => {
  currentActivity.value = row
  detailVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该活动吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = activitiesList.value.findIndex(v => v.id === row.id)
    if (index !== -1) {
      activitiesList.value.splice(index, 1)
      ElMessage.success('活动删除成功')
    }
  }).catch(() => {})
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 图片上传前的校验
const beforeImageUpload = (file) => {
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

// 自定义图片上传
const handleImageUpload = (options) => {
  const { file } = options
  // 这里模拟上传，实际项目中应该调用上传API
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.image = e.target.result
    ElMessage.success('图片上传成功')
  }
  reader.readAsDataURL(file)
}
</script>

<style lang="scss" scoped>
@use './styles/info.scss';
</style>
