<template>
  <div class="forum-create-post">
    <div class="create-container">
      <div class="page-header">
        <h1>发布帖子</h1>
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="post-form"
      >
        <el-form-item label="帖子标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入帖子标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="帖子分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="全部" value="全部" />
            <el-option label="篮球" value="篮球" />
            <el-option label="足球" value="足球" />
            <el-option label="羽毛球" value="羽毛球" />
            <el-option label="乒乓球" value="乒乓球" />
            <el-option label="网球" value="网球" />
            <el-option label="游泳" value="游泳" />
            <el-option label="健身" value="健身" />
            <el-option label="跑步" value="跑步" />
            <el-option label="瑜伽" value="瑜伽" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>

        <el-form-item label="帖子摘要" prop="summary">
          <el-input
            v-model="formData.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入帖子摘要（将在列表中显示）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="上传图片">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
            :on-exceed="handleExceed"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">最多上传3张图片</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="帖子内容" prop="content">
          <MdEditor
            v-model="formData.content"
            :preview="true"
            :toolbars="toolbars"
            placeholder="请输入帖子内容，支持Markdown格式"
            style="height: 600px"
          />
        </el-form-item>

        <el-form-item>
          <div style="display: flex; justify-content: flex-end; gap: 12px; width: 100%;">
            <el-button size="large" @click="goBack">
              取消
            </el-button>
            <el-button type="primary" size="large" @click="handleSubmit" :loading="submitting">
              发布帖子
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)
const fileList = ref([])

const formData = reactive({
  title: '',
  category: '',
  summary: '',
  content: ''
})

const rules = {
  title: [
    { required: true, message: '请输入帖子标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择帖子分类', trigger: 'change' }
  ],
  summary: [
    { required: true, message: '请输入帖子摘要', trigger: 'blur' },
    { min: 10, max: 200, message: '摘要长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
    { min: 20, message: '内容至少 20 个字符', trigger: 'blur' }
  ]
}

const toolbars = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview'
]

const handleExceed = () => {
  ElMessage.warning('最多只能上传3张图片')
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    // 模拟提交
    setTimeout(() => {
      ElMessage.success('帖子发布成功')
      submitting.value = false
      router.push('/student/forum')
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
@use './styles/create.scss';
</style>
