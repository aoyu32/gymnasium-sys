<template>
  <div class="student-forum">
    <div class="page-header">
      <h1>体育论坛</h1>
      <p>分享运动心得，结识运动伙伴</p>
      <el-button type="primary" @click="showPostDialog = true">
        <el-icon><Edit /></el-icon>
        发布帖子
      </el-button>
    </div>

    <div class="forum-content">
      <!-- 分类标签 -->
      <div class="category-tabs">
        <div
          v-for="item in categories"
          :key="item.value"
          class="category-item"
          :class="{ active: currentCategory === item.value }"
          @click="currentCategory = item.value"
        >
          {{ item.label }}
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="posts-list">
        <div v-for="post in posts" :key="post.id" class="post-item">
          <div class="post-avatar">
            <el-avatar :size="48" :src="post.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
          </div>
          <div class="post-content">
            <div class="post-header">
              <span class="author">{{ post.author }}</span>
              <span class="time">{{ post.time }}</span>
            </div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-text">{{ post.content }}</p>
            <div v-if="post.images?.length" class="post-images">
              <img
                v-for="(img, index) in post.images"
                :key="index"
                :src="img"
                alt="图片"
              />
            </div>
            <div class="post-footer">
              <div class="post-stats">
                <span><el-icon><View /></el-icon> {{ post.views }}</span>
                <span><el-icon><ChatDotRound /></el-icon> {{ post.comments }}</span>
              </div>
              <div class="post-actions">
                <el-button text @click="handleLike(post)">
                  <el-icon><Star /></el-icon>
                  点赞 {{ post.likes }}
                </el-button>
                <el-button text @click="handleComment(post)">
                  <el-icon><ChatLineRound /></el-icon>
                  评论
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发帖对话框 -->
    <el-dialog v-model="showPostDialog" title="发布帖子" width="600px">
      <el-form :model="postForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="postForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="postForm.category" placeholder="选择分类">
            <el-option
              v-for="item in categories.slice(1)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="6"
            placeholder="分享你的运动心得..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPostDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePublish">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Edit,
  User,
  View,
  ChatDotRound,
  Star,
  ChatLineRound
} from '@element-plus/icons-vue'

const currentCategory = ref('all')
const showPostDialog = ref(false)

const categories = [
  { label: '全部', value: 'all' },
  { label: '篮球', value: 'basketball' },
  { label: '羽毛球', value: 'badminton' },
  { label: '足球', value: 'football' },
  { label: '健身', value: 'fitness' },
  { label: '其他', value: 'other' }
]

const postForm = ref({
  title: '',
  category: '',
  content: ''
})

const posts = ref([
  {
    id: 1,
    author: '张三',
    avatar: '',
    time: '2小时前',
    title: '分享一下我的篮球训练心得',
    content: '最近坚持每天练习投篮，终于有了明显进步。分享几个小技巧给大家...',
    images: [],
    views: 128,
    comments: 15,
    likes: 32
  },
  {
    id: 2,
    author: '李四',
    avatar: '',
    time: '5小时前',
    title: '羽毛球新手入门指南',
    content: '作为一个羽毛球爱好者，整理了一些新手常见问题和解决方法...',
    images: [],
    views: 256,
    comments: 28,
    likes: 56
  }
])

const handleLike = (post) => {
  post.likes++
  ElMessage.success('点赞成功')
}

const handleComment = (post) => {
  ElMessage.info('评论功能开发中')
}

const handlePublish = () => {
  if (!postForm.value.title || !postForm.value.content) {
    ElMessage.warning('请填写完整信息')
    return
  }
  ElMessage.success('发布成功')
  showPostDialog.value = false
  postForm.value = { title: '', category: '', content: '' }
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
