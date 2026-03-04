<template>
  <div class="student-profile">
    <div class="profile-content">
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="profile-card">
            <div class="avatar-wrapper" @click="triggerAvatarUpload">
              <el-avatar :size="100" :src="userInfo.avatar">
                <el-icon :size="50"><User /></el-icon>
              </el-avatar>
              <div class="avatar-overlay">
                <el-icon :size="24"><Camera /></el-icon>
                <span>更换头像</span>
              </div>
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleAvatarChange"
            />
            <h3>{{ userInfo.name }}</h3>
            <p class="student-id">{{ userInfo.studentId }}</p>
            
            <div class="user-info-list">
              <div class="info-item">
                <span class="label">性别：</span>
                <span class="value">{{ userInfo.gender || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="label">生日：</span>
                <span class="value">{{ userInfo.birthday || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="label">学院：</span>
                <span class="value">{{ userInfo.college || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="label">专业：</span>
                <span class="value">{{ userInfo.major || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="label">年级：</span>
                <span class="value">{{ userInfo.grade || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="label">班级：</span>
                <span class="value">{{ userInfo.classInfo || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="label">手机：</span>
                <span class="value">{{ userInfo.phone || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="label">邮箱：</span>
                <span class="value">{{ userInfo.email || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="label">QQ：</span>
                <span class="value">{{ userInfo.qq || '未设置' }}</span>
              </div>
              <div class="info-item">
                <span class="label">籍贯：</span>
                <span class="value">{{ userInfo.address || '未设置' }}</span>
              </div>
            </div>
            
            <el-button type="primary" @click="showEditDialog = true" style="width: 100%; margin-top: 20px;">
              编辑资料
            </el-button>
          </div>
        </el-col>

        <el-col :span="18">
          <el-tabs v-model="activeTab">
            <!-- 私人活动申请记录 -->
            <el-tab-pane label="私人活动" name="privateActivities">
              <el-table :data="privateActivityApplications" stripe @row-click="handleViewApplicationDetail">
                <el-table-column prop="applicantName" label="申请人" width="100" />
                <el-table-column prop="activityName" label="活动名称" show-overflow-tooltip />
                <el-table-column prop="applyTime" label="申请时间" width="160" />
                <el-table-column prop="phone" label="联系方式" width="120" />
                <el-table-column prop="reason" label="申请理由" show-overflow-tooltip />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="280" fixed="right">
                  <template #default="{ row }">
                    <el-button 
                      v-if="row.status === 'pending'" 
                      link
                      type="success" 
                      size="small"
                      @click.stop="handleApprove(row)"
                    >
                      通过
                    </el-button>
                    <el-button 
                      v-if="row.status === 'pending'" 
                      link
                      type="warning" 
                      size="small"
                      @click.stop="handleReject(row)"
                    >
                      拒绝
                    </el-button>
                    <el-button 
                      link
                      type="danger" 
                      size="small"
                      @click.stop="handleCancelActivity(row)"
                    >
                      取消活动
                    </el-button>
                    <el-button 
                      link
                      type="danger" 
                      size="small"
                      @click.stop="handleDeleteApplication(row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 活动预约记录 -->
            <el-tab-pane label="活动预约记录" name="activityBookings">
              <el-table :data="activityBookings" stripe @row-click="handleViewBookingDetail">
                <el-table-column prop="activityName" label="活动名称" show-overflow-tooltip />
                <el-table-column prop="activityType" label="活动类型" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.activityType === '公共' ? 'success' : 'primary'" size="small">
                      {{ row.activityType }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="日期" width="120" />
                <el-table-column prop="time" label="时间" width="140" />
                <el-table-column prop="location" label="地点" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template #default="{ row }">
                    <el-button 
                      v-if="row.status === 'pending' || row.status === 'approved'" 
                      link
                      type="warning" 
                      size="small"
                      @click.stop="handleCancelBooking(row)"
                    >
                      取消参加
                    </el-button>
                    <el-button 
                      link
                      type="danger" 
                      size="small"
                      @click.stop="handleDeleteBooking(row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 场地申请记录 -->
            <el-tab-pane label="场地申请记录" name="venueBookings">
              <el-table :data="venueBookings" stripe @row-click="handleViewVenueDetail">
                <el-table-column prop="venueName" label="场地名称" />
                <el-table-column prop="date" label="使用日期" />
                <el-table-column prop="time" label="使用时段" />
                <el-table-column prop="activityType" label="活动类型" />
                <el-table-column prop="participants" label="参与人数" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                  <template #default="{ row }">
                    <el-button link type="primary" size="small" @click.stop="handleViewVenueDetail(row)">查看详情</el-button>
                    <el-button
                      v-if="row.status === 'pending'"
                      link
                      type="danger"
                      size="small"
                      @click.stop="handleCancelVenue(row)"
                    >
                      取消申请
                    </el-button>
                    <el-button
                      link
                      type="danger"
                      size="small"
                      @click.stop="handleDeleteVenue(row)"
                    >
                      删除记录
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 器材借还记录 -->
            <el-tab-pane label="器材借还记录" name="equipmentRecords">
              <el-table :data="equipmentRecords" stripe @row-click="handleViewEquipmentDetail">
                <el-table-column prop="equipmentName" label="器材名称" width="120" />
                <el-table-column prop="brand" label="品牌规格" min-width="180" show-overflow-tooltip />
                <el-table-column prop="quantity" label="数量" width="80" align="center" />
                <el-table-column prop="borrowDate" label="借用日期" width="120" />
                <el-table-column prop="returnDate" label="应还日期" width="120" />
                <el-table-column prop="status" label="状态" width="120" align="center">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="240" fixed="right">
                  <template #default="{ row }">
                    <el-button link type="primary" size="small" @click.stop="handleViewEquipmentDetail(row)">查看详情</el-button>
                    <el-button
                      v-if="row.status === 'approved'"
                      link
                      type="warning"
                      size="small"
                      @click.stop="handleReturnEquipment(row)"
                    >
                      归还
                    </el-button>
                    <el-button
                      v-if="row.status === 'returning'"
                      link
                      type="info"
                      size="small"
                      disabled
                    >
                      审核中
                    </el-button>
                    <el-button
                      link
                      type="danger"
                      size="small"
                      @click.stop="handleDeleteEquipment(row)"
                    >
                      删除记录
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 账号安全 -->
            <el-tab-pane label="账号安全" name="security">
              <div class="security-content">
                <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px" style="max-width: 500px">
                  <el-form-item label="原密码" prop="oldPassword">
                    <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" show-password />
                  </el-form-item>
                  <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
                  </el-form-item>
                  <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
                    <el-button @click="handleResetPasswordForm">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog v-model="showEditDialog" title="编辑资料" width="600px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="editForm.studentId" disabled />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="学院">
          <el-select v-model="editForm.college" placeholder="请选择学院" style="width: 100%">
            <el-option label="计算机学院" value="计算机学院" />
            <el-option label="软件学院" value="软件学院" />
            <el-option label="信息工程学院" value="信息工程学院" />
            <el-option label="电子工程学院" value="电子工程学院" />
            <el-option label="机械工程学院" value="机械工程学院" />
            <el-option label="材料科学学院" value="材料科学学院" />
            <el-option label="化学化工学院" value="化学化工学院" />
            <el-option label="生命科学学院" value="生命科学学院" />
            <el-option label="数学学院" value="数学学院" />
            <el-option label="物理学院" value="物理学院" />
            <el-option label="经济管理学院" value="经济管理学院" />
            <el-option label="外国语学院" value="外国语学院" />
            <el-option label="艺术学院" value="艺术学院" />
            <el-option label="体育学院" value="体育学院" />
            <el-option label="法学院" value="法学院" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="editForm.major" />
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="editForm.grade" placeholder="请选择年级" style="width: 100%">
            <el-option label="2021级" value="2021级" />
            <el-option label="2022级" value="2022级" />
            <el-option label="2023级" value="2023级" />
            <el-option label="2024级" value="2024级" />
            <el-option label="2025级" value="2025级" />
            <el-option label="2026级" value="2026级" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="editForm.classInfo" placeholder="例如：软件2101班" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="QQ号">
          <el-input v-model="editForm.qq" />
        </el-form-item>
        <el-form-item label="籍贯">
          <el-input v-model="editForm.address" placeholder="例如：江苏省南京市" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 申请详情对话框 -->
    <el-dialog
      v-model="applicationDetailVisible"
      title="申请详情"
      width="600px"
    >
      <el-descriptions :column="1" border v-if="currentApplication">
        <el-descriptions-item label="申请人">{{ currentApplication.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="活动名称">{{ currentApplication.activityName }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ currentApplication.phone }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentApplication.applyTime }}</el-descriptions-item>
        <el-descriptions-item label="申请理由">{{ currentApplication.reason }}</el-descriptions-item>
        <el-descriptions-item label="申请状态">
          <el-tag :type="getStatusType(currentApplication.status)">{{ currentApplication.statusText }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentApplication.rejectReason" label="拒绝原因">
          {{ currentApplication.rejectReason }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="applicationDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 活动预约详情对话框 -->
    <el-dialog
      v-model="bookingDetailVisible"
      title="预约详情"
      width="600px"
    >
      <el-descriptions :column="1" border v-if="currentBooking">
        <el-descriptions-item label="活动名称">{{ currentBooking.activityName }}</el-descriptions-item>
        <el-descriptions-item label="活动类型">
          <el-tag :type="currentBooking.activityType === '公共' ? 'success' : 'primary'" size="small">
            {{ currentBooking.activityType }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="活动日期">{{ currentBooking.date }}</el-descriptions-item>
        <el-descriptions-item label="活动时间">{{ currentBooking.time }}</el-descriptions-item>
        <el-descriptions-item label="活动地点">{{ currentBooking.location }}</el-descriptions-item>
        <el-descriptions-item label="预约状态">
          <el-tag :type="getStatusType(currentBooking.status)">{{ currentBooking.statusText }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="bookingDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 场地申请详情对话框 -->
    <el-dialog
      v-model="venueDetailVisible"
      title="申请详情"
      width="600px"
    >
      <el-descriptions :column="1" border v-if="currentVenue">
        <el-descriptions-item label="场地名称">{{ currentVenue.venueName }}</el-descriptions-item>
        <el-descriptions-item label="场地区域">{{ currentVenue.areaName || '无区域划分' }}</el-descriptions-item>
        <el-descriptions-item label="使用日期">{{ currentVenue.date }}</el-descriptions-item>
        <el-descriptions-item label="使用时段">{{ currentVenue.time }}</el-descriptions-item>
        <el-descriptions-item label="活动类型">{{ currentVenue.activityType }}</el-descriptions-item>
        <el-descriptions-item label="参与人数">{{ currentVenue.participants }}人</el-descriptions-item>
        <el-descriptions-item label="申请人姓名">{{ currentVenue.applicantName || '张三' }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentVenue.phone || '13800138000' }}</el-descriptions-item>
        <el-descriptions-item label="学号/工号">{{ currentVenue.studentId || '2021001' }}</el-descriptions-item>
        <el-descriptions-item label="申请理由">{{ currentVenue.reason || '组织班级篮球活动，增强同学们的体质和团队协作能力。' }}</el-descriptions-item>
        <el-descriptions-item label="申请状态">
          <el-tag :type="getStatusType(currentVenue.status)">{{ currentVenue.statusText }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentVenue.applyTime || '2026-02-20 10:30:00' }}</el-descriptions-item>
        <el-descriptions-item v-if="currentVenue.status === 'rejected'" label="拒绝原因">
          {{ currentVenue.rejectReason || '该时段场地已被预约' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="venueDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 器材借用详情对话框 -->
    <el-dialog
      v-model="equipmentDetailVisible"
      title="借用详情"
      width="600px"
    >
      <el-descriptions :column="1" border v-if="currentEquipment">
        <el-descriptions-item label="器材名称">{{ currentEquipment.equipmentName }}</el-descriptions-item>
        <el-descriptions-item label="品牌规格">{{ currentEquipment.brand }}</el-descriptions-item>
        <el-descriptions-item label="借用数量">{{ currentEquipment.quantity }}件</el-descriptions-item>
        <el-descriptions-item label="借用日期">{{ currentEquipment.borrowDate }}</el-descriptions-item>
        <el-descriptions-item label="应还日期">{{ currentEquipment.returnDate }}</el-descriptions-item>
        <el-descriptions-item label="借用人">{{ currentEquipment.borrower || '张三' }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentEquipment.phone || '13800138000' }}</el-descriptions-item>
        <el-descriptions-item label="学号/工号">{{ currentEquipment.studentId || '2021001' }}</el-descriptions-item>
        <el-descriptions-item label="借用理由">{{ currentEquipment.reason || '体育课使用' }}</el-descriptions-item>
        <el-descriptions-item label="借用状态">
          <el-tag :type="getStatusType(currentEquipment.status)">{{ currentEquipment.statusText }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentEquipment.status === 'returned'" label="归还日期">
          {{ currentEquipment.actualReturnDate || '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="equipmentDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 归还器材对话框 -->
    <el-dialog
      v-model="returnDialogVisible"
      title="归还器材"
      width="600px"
    >
      <el-form
        ref="returnFormRef"
        :model="returnForm"
        :rules="returnRules"
        label-width="120px"
      >
        <el-form-item label="器材名称">
          <el-input v-model="currentReturnEquipment.equipmentName" disabled />
        </el-form-item>
        <el-form-item label="品牌规格">
          <el-input v-model="currentReturnEquipment.brand" disabled />
        </el-form-item>
        <el-form-item label="借用数量">
          <el-input v-model="currentReturnEquipment.quantity" disabled>
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="上传器材照片" prop="images" required>
          <el-upload
            v-model:file-list="returnForm.images"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                请上传器材照片，最多3张，用于验证器材完好性
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="器材状态" prop="condition">
          <el-radio-group v-model="returnForm.condition">
            <el-radio value="good">完好无损</el-radio>
            <el-radio value="normal">轻微磨损</el-radio>
            <el-radio value="damaged">有损坏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input
            v-model="returnForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请说明器材使用情况或损坏情况（如有）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="returnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReturn">提交归还申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Camera, Plus } from '@element-plus/icons-vue'
import { getMyBorrowRecords, deleteBorrowApplication, createReturnApplication } from '@/api/equipment'
import { getCurrentStudentInfo, updateStudentInfo, changePassword, updateAvatar } from '@/api/student'
import { uploadImage } from '@/api/file'

const activeTab = ref('privateActivities')
const showEditDialog = ref(false)
const avatarInput = ref(null)
const passwordFormRef = ref(null)
const returnFormRef = ref(null)

// 详情对话框状态
const applicationDetailVisible = ref(false)
const bookingDetailVisible = ref(false)
const venueDetailVisible = ref(false)
const equipmentDetailVisible = ref(false)
const returnDialogVisible = ref(false)

// 当前选中的记录
const currentApplication = ref(null)
const currentBooking = ref(null)
const currentVenue = ref(null)
const currentEquipment = ref(null)
const currentReturnEquipment = ref({})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 归还表单
const returnForm = ref({
  images: [],
  condition: 'good',
  remark: ''
})

const returnRules = {
  images: [
    { required: true, message: '请上传器材照片', trigger: 'change' }
  ],
  condition: [
    { required: true, message: '请选择器材状态', trigger: 'change' }
  ]
}

const userInfo = ref({
  name: '',
  studentId: '',
  gender: '',
  grade: '',
  college: '',
  major: '',
  classInfo: '',
  phone: '',
  email: '',
  qq: '',
  birthday: '',
  address: '',
  avatar: ''
})

const editForm = ref({ ...userInfo.value })

// 私人活动申请记录（别人申请参加我的活动）
const privateActivityApplications = ref([
  {
    id: 1,
    applicantName: '李四',
    activityName: '周末篮球友谊赛',
    applyTime: '2026-02-24 10:30',
    phone: '138****6666',
    reason: '热爱篮球运动，希望能参加',
    status: 'pending',
    statusText: '待审核'
  },
  {
    id: 2,
    applicantName: '王五',
    activityName: '周末篮球友谊赛',
    applyTime: '2026-02-24 11:00',
    phone: '139****7777',
    reason: '想提高篮球技术',
    status: 'approved',
    statusText: '已通过'
  },
  {
    id: 3,
    applicantName: '赵六',
    activityName: '羽毛球训练营',
    applyTime: '2026-02-23 15:20',
    phone: '137****8888',
    reason: '想学习羽毛球',
    status: 'rejected',
    statusText: '已拒绝'
  }
])

// 活动预约记录（我参加别人的活动）
const activityBookings = ref([
  {
    id: 1,
    activityName: '篮球友谊赛',
    activityType: '公共',
    date: '2026-02-26',
    time: '14:00-16:00',
    location: '篮球馆A场',
    status: 'approved',
    statusText: '已通过'
  },
  {
    id: 2,
    activityName: '足球比赛',
    activityType: '私人',
    date: '2026-02-27',
    time: '15:00-17:00',
    location: '足球场',
    status: 'pending',
    statusText: '待审核'
  }
])

// 场地申请记录
const venueBookings = ref([
  {
    id: 1,
    venueId: 1,
    venueName: '篮球馆A场',
    areaName: 'A1场地',
    date: '2026-02-25',
    time: '18:00-20:00',
    activityType: '篮球',
    participants: 10,
    status: 'approved',
    statusText: '已通过',
    applicantName: '张三',
    phone: '13800138000',
    studentId: '2021001',
    reason: '组织班级篮球活动，增强同学们的体质和团队协作能力。',
    applyTime: '2026-02-20 10:30:00'
  },
  {
    id: 2,
    venueId: 2,
    venueName: '羽毛球馆',
    areaName: '1号场地',
    date: '2026-02-26',
    time: '16:00-18:00',
    activityType: '羽毛球',
    participants: 8,
    status: 'pending',
    statusText: '待审批',
    applicantName: '张三',
    phone: '13800138000',
    studentId: '2021001',
    reason: '羽毛球社团日常训练活动。',
    applyTime: '2026-02-22 15:20:00'
  }
])

const equipmentRecords = ref([])

// 加载学生信息
const loadStudentInfo = async () => {
  try {
    const res = await getCurrentStudentInfo()
    if (res.data) {
      userInfo.value = {
        name: res.data.name || '',
        studentId: res.data.studentId || '',
        gender: res.data.gender || '',
        grade: res.data.grade || '',
        college: res.data.college || '',
        major: res.data.major || '',
        classInfo: res.data.classInfo || '',
        phone: res.data.phone || '',
        email: res.data.email || '',
        qq: res.data.qq || '',
        birthday: res.data.birthday || '',
        address: res.data.address || '',
        avatar: res.data.avatar || ''
      }
      editForm.value = { ...userInfo.value }
    }
  } catch (error) {
    console.error('加载学生信息失败:', error)
    ElMessage.error('加载学生信息失败')
  }
}

// 加载器材借还记录
const loadEquipmentRecords = async () => {
  try {
    const res = await getMyBorrowRecords()
    equipmentRecords.value = (res.data || []).map(item => ({
      ...item,
      brand: item.brandName ? `${item.brandName} ${item.brandModel || ''}` : '-',
      returnDate: item.expectedReturnDate,
      statusText: getEquipmentStatusText(item.status)
    }))
  } catch (error) {
    console.error('加载器材借还记录失败:', error)
    ElMessage.error('加载器材借还记录失败')
  }
}

const getEquipmentStatusText = (status) => {
  const textMap = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝',
    returning: '归还审核中',
    returned: '已归还'
  }
  return textMap[status] || status
}

onMounted(() => {
  loadStudentInfo()
  loadEquipmentRecords()
})

const handleSave = async () => {
  try {
    await updateStudentInfo({
      name: editForm.value.name,
      gender: editForm.value.gender,
      birthday: editForm.value.birthday,
      college: editForm.value.college,
      major: editForm.value.major,
      grade: editForm.value.grade,
      classInfo: editForm.value.classInfo,
      phone: editForm.value.phone,
      email: editForm.value.email,
      qq: editForm.value.qq,
      address: editForm.value.address
    })
    
    Object.assign(userInfo.value, editForm.value)
    showEditDialog.value = false
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '保存失败')
  }
}

const getStatusType = (status) => {
  const typeMap = {
    approved: 'success',
    pending: 'warning',
    borrowed: 'warning',
    returning: 'info',
    returned: 'success',
    rejected: 'danger',
    overdue: 'danger'
  }
  return typeMap[status] || 'info'
}

const getActivityStatusType = (status) => {
  const typeMap = {
    ongoing: 'success',
    full: 'warning',
    ended: 'info'
  }
  return typeMap[status] || 'info'
}

// 私人活动相关
const handleCancelActivity = (activity) => {
  ElMessageBox.confirm(`确定取消活动"${activity.activityName}"吗？取消后所有申请将被拒绝。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('活动已取消')
    // TODO: 调用API取消活动
  }).catch(() => {})
}

const handleViewApplicationDetail = (row) => {
  currentApplication.value = row
  applicationDetailVisible.value = true
}

const handleApprove = (application) => {
  ElMessageBox.confirm(`确定通过 ${application.applicantName} 的申请吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    application.status = 'approved'
    application.statusText = '已通过'
    ElMessage.success('已通过申请')
  }).catch(() => {})
}

const handleReject = (application) => {
  ElMessageBox.prompt('请输入拒绝原因', '拒绝申请', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '请输入拒绝原因'
  }).then(({ value }) => {
    application.status = 'rejected'
    application.statusText = '已拒绝'
    application.rejectReason = value
    ElMessage.success('已拒绝申请')
  }).catch(() => {})
}

const handleDeleteApplication = (application) => {
  ElMessageBox.confirm(`确定删除 ${application.applicantName} 的申请记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = privateActivityApplications.value.findIndex(item => item.id === application.id)
    if (index > -1) {
      privateActivityApplications.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 活动预约相关
const handleViewBookingDetail = (row) => {
  currentBooking.value = row
  bookingDetailVisible.value = true
}

const handleCancelBooking = (booking) => {
  ElMessageBox.confirm(`确定取消参加"${booking.activityName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('已取消参加')
  }).catch(() => {})
}

const handleDeleteBooking = (booking) => {
  ElMessageBox.confirm(`确定删除"${booking.activityName}"的预约记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = activityBookings.value.findIndex(item => item.id === booking.id)
    if (index > -1) {
      activityBookings.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 场地申请相关
const handleViewVenueDetail = (row) => {
  currentVenue.value = row
  venueDetailVisible.value = true
}

const handleCancelVenue = (venue) => {
  ElMessageBox.confirm(`确定取消"${venue.venueName}"的申请吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('已取消申请')
    // TODO: 调用API取消申请
  }).catch(() => {})
}

const handleDeleteVenue = (venue) => {
  ElMessageBox.confirm(`确定删除"${venue.venueName}"的申请记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = venueBookings.value.findIndex(item => item.id === venue.id)
    if (index > -1) {
      venueBookings.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 器材借还相关
const handleViewEquipmentDetail = (row) => {
  currentEquipment.value = row
  equipmentDetailVisible.value = true
}

const handleReturnEquipment = (equipment) => {
  currentReturnEquipment.value = { ...equipment }
  returnForm.value = {
    images: [],
    condition: 'good',
    remark: ''
  }
  returnDialogVisible.value = true
}

const confirmReturn = async () => {
  if (!returnFormRef.value) return
  
  await returnFormRef.value.validate(async (valid) => {
    if (valid) {
      if (returnForm.value.images.length === 0) {
        ElMessage.warning('请上传器材照片')
        return
      }
      
      try {
        // 提取图片URL（实际项目中需要先上传图片到服务器）
        const imageUrls = returnForm.value.images.map(file => {
          return file.url || 'https://via.placeholder.com/400'
        })
        
        await createReturnApplication({
          borrowId: currentReturnEquipment.value.id,
          condition: returnForm.value.condition,
          remark: returnForm.value.remark,
          images: imageUrls
        })
        
        ElMessage.success('归还申请已提交，请等待审核')
        returnDialogVisible.value = false
        
        // 重新加载借还记录
        loadEquipmentRecords()
      } catch (error) {
        console.error('提交归还申请失败:', error)
        ElMessage.error('提交归还申请失败')
      }
    }
  })
}

const handleDeleteEquipment = (equipment) => {
  ElMessageBox.confirm(`确定删除"${equipment.equipmentName}"的借还记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteBorrowApplication(equipment.id)
      ElMessage.success('删除成功')
      loadEquipmentRecords()
    } catch (error) {
      console.error('删除记录失败:', error)
      ElMessage.error('删除记录失败')
    }
  }).catch(() => {})
}

// 账号安全相关
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    
    await changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword
    })
    
    ElMessage.success('密码修改成功')
    handleResetPasswordForm()
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error(error.message || '修改密码失败')
  }
}

const handleResetPasswordForm = () => {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordFormRef.value?.clearValidate()
}

// 头像上传相关
const triggerAvatarUpload = () => {
  avatarInput.value.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 验证文件大小（限制为5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB')
    return
  }

  try {
    // 上传图片到OSS
    const res = await uploadImage(file, 'avatar')
    const avatarUrl = res.data
    
    // 更新头像
    await updateAvatar(avatarUrl)
    
    // 更新本地显示
    userInfo.value.avatar = avatarUrl
    ElMessage.success('头像上传成功')
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error(error.message || '头像上传失败')
  }

  // 清空input，允许重复选择同一文件
  event.target.value = ''
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
