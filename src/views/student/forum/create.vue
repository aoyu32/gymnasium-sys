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

        <el-form-item label="帖子分类" prop="categoryId">
          <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { createPost, getAllCategories } from '@/api/forum'
import { uploadImage } from '@/api/file'

const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)
const fileList = ref([])
const categories = ref([])

const formData = reactive({
  title: '',
  categoryId: null,
  summary: '',
  content: '',
  images: []
})

const rules = {
  title: [
    { required: true, message: '请输入帖子标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  categoryId: [
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

// 加载分类
const loadCategories = async () => {
  try {
    const res = await getAllCategories()
    categories.value = res.data || []
  } catch (error) {
    console.error('加载分类失败:', error)
    ElMessage.error('加载分类失败')
  }
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传3张图片')
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    // 上传图片
    const imageUrls = []
    for (const file of fileList.value) {
      if (file.raw) {
        try {
          const res = await uploadImage(file.raw)
          imageUrls.push(res.data)
        } catch (error) {
          console.error('图片上传失败:', error)
        }
      }
    }

    // 提交帖子
    await createPost({
      title: formData.title,
      categoryId: formData.categoryId,
      summary: formData.summary,
      content: formData.content,
      images: imageUrls
    })

    ElMessage.success('帖子发布成功')
    router.push('/student/forum')
  } catch (error) {
    console.error('发布失败:', error)
    // 如果是表单验证错误
    if (error && typeof error === 'object' && !error.response) {
      ElMessage.error('请检查表单填写是否完整')
      return
    }
    // 如果是后端返回的错误
    ElMessage.error(error.response?.data?.message || '发布失败')
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadCategories()
})
</script>

<style lang="scss" scoped>
@use './styles/create.scss';
</style>
