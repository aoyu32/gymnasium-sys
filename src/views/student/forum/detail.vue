<template>
  <div class="forum-post-detail">
    <div v-if="post" class="detail-container">
      <!-- 帖子内容 -->
      <div class="post-main">
        <!-- 帖子卡片 -->
        <div class="post-card">
          <div class="post-header">
            <div class="author-info">
              <el-avatar :size="48" :src="post.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="author-meta">
                <div class="author-name">{{ post.author }}</div>
                <div class="post-time">2026-02-24 14:30</div>
              </div>
            </div>
            <div class="author-stats">
              <div class="stat-item">
                <span class="stat-label">帖子</span>
                <span class="stat-value">12</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">获赞</span>
                <span class="stat-value">156</span>
              </div>
            </div>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>

          <div class="post-content">
            <div v-html="renderedContent" class="markdown-body"></div>
          </div>

          <div v-if="post.images?.length" class="post-images">
            <el-image
              v-for="(img, index) in post.images"
              :key="index"
              :src="img"
              :preview-src-list="post.images"
              :initial-index="index"
              fit="cover"
            />
          </div>

          <div class="post-footer">
            <div class="post-stats">
              <span><el-icon><View /></el-icon> {{ post.views }}</span>
              <span><el-icon><ChatDotRound /></el-icon> {{ comments.length }}</span>
            </div>
            <div class="post-actions">
              <el-button @click="handleLike" :type="isLiked ? 'primary' : 'default'">
                <el-icon><Star /></el-icon>
                {{ isLiked ? '已点赞' : '点赞' }} {{ post.likes }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <div class="comments-header">
            <h2>评论 ({{ comments.length }})</h2>
          </div>

          <!-- 发表评论 -->
          <div class="comment-input">
            <el-avatar :size="40">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="input-wrapper">
              <el-input
                v-model="commentContent"
                type="textarea"
                :rows="3"
                placeholder="发表你的看法..."
                maxlength="500"
                show-word-limit
              />
              <el-button type="primary" @click="handleSubmitComment" :disabled="!commentContent.trim()">
                发表评论
              </el-button>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <el-avatar :size="40" :src="comment.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="comment-content">
                <div class="comment-header">
                  <div class="comment-info">
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-time">{{ comment.time }}</span>
                  </div>
                  <div class="comment-actions">
                    <el-button text size="small" @click="handleLikeComment(comment)">
                      <el-icon><Star /></el-icon>
                      {{ comment.likes }}
                    </el-button>
                    <el-button text size="small" @click="handleReply(comment)">
                      <el-icon><ChatLineRound /></el-icon>
                      回复
                    </el-button>
                  </div>
                </div>
                <div class="comment-text">{{ comment.content }}</div>

                <!-- 回复输入框 -->
                <div v-if="replyingTo === comment.id" class="reply-input">
                  <el-input
                    v-model="replyContent"
                    type="textarea"
                    :rows="2"
                    :placeholder="`回复 ${comment.author}...`"
                    maxlength="200"
                    show-word-limit
                  />
                  <div class="reply-actions">
                    <el-button size="small" @click="cancelReply">取消</el-button>
                    <el-button type="primary" size="small" @click="submitReply(comment)" :disabled="!replyContent.trim()">
                      发送
                    </el-button>
                  </div>
                </div>

                <!-- 回复列表 -->
                <div v-if="comment.replies?.length" class="replies-list">
                  <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                    <el-avatar :size="32" :src="reply.avatar">
                      <el-icon><User /></el-icon>
                    </el-avatar>
                    <div class="reply-content">
                      <div class="reply-header">
                        <span class="reply-author">{{ reply.author }}</span>
                        <span class="reply-time">{{ reply.time }}</span>
                      </div>
                      <div class="reply-text">{{ reply.content }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="post-sidebar">
        <!-- 发布帖子按钮 -->
        <div class="publish-card">
          <el-button type="primary" size="large" style="width: 100%" @click="goToCreatePost">
            <el-icon><Edit /></el-icon>
            发布帖子
          </el-button>
        </div>

        <!-- 热门帖子 -->
        <HotPosts :hot-posts="hotPosts" @view-post="goToPost" />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <el-empty description="帖子不存在或已被删除">
        <el-button type="primary" @click="goToForum">返回论坛</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit, User, View, ChatDotRound, Star, ChatLineRound } from '@element-plus/icons-vue'
import HotPosts from './components/HotPosts.vue'
import { posts } from '@/mock/posts'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const commentContent = ref('')
const replyContent = ref('')
const replyingTo = ref(null)
const isLiked = ref(false)

// 评论数据
const comments = ref([
  {
    id: 1,
    author: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment1',
    time: '2026-02-24 13:30',
    content: '写得很好，学到了很多！',
    likes: 5,
    replies: [
      {
        id: 11,
        author: '张三',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        time: '2026-02-24 14:00',
        content: '谢谢支持！'
      }
    ]
  },
  {
    id: 2,
    author: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment2',
    time: '2026-02-24 12:30',
    content: '请问有视频教程吗？',
    likes: 3,
    replies: []
  }
])

onMounted(() => {
  const id = parseInt(route.params.id)
  post.value = posts.find(item => item.id === id)
  if (post.value) {
    post.value.views++
  }
})

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return marked(post.value.content)
})

// 热门帖子
const hotPosts = computed(() => {
  return [...posts]
    .filter(p => p.isHot)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)
})

const handleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    post.value.likes++
    ElMessage.success('点赞成功')
  } else {
    post.value.likes--
  }
}

const handleSubmitComment = () => {
  if (!commentContent.value.trim()) return
  
  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  
  const newComment = {
    id: Date.now(),
    author: '当前用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
    time: timeStr,
    content: commentContent.value,
    likes: 0,
    replies: []
  }
  
  comments.value.unshift(newComment)
  commentContent.value = ''
  ElMessage.success('评论发表成功')
}

const handleReply = (comment) => {
  replyingTo.value = comment.id
  replyContent.value = ''
}

const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

const submitReply = (comment) => {
  if (!replyContent.value.trim()) return
  
  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  
  const newReply = {
    id: Date.now(),
    author: '当前用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
    time: timeStr,
    content: replyContent.value
  }
  
  if (!comment.replies) {
    comment.replies = []
  }
  comment.replies.push(newReply)
  
  cancelReply()
  ElMessage.success('回复成功')
}

const handleLikeComment = (comment) => {
  comment.likes++
  ElMessage.success('点赞成功')
}

const goToPost = (post) => {
  router.push(`/student/forum/${post.id}`)
  // 重新加载帖子数据
  const id = parseInt(post.id)
  const newPost = posts.find(item => item.id === id)
  if (newPost) {
    window.location.reload()
  }
}

const goToForum = () => {
  router.push('/student/forum')
}

const goToCreatePost = () => {
  router.push('/student/forum/create')
}
</script>

<style lang="scss" scoped>
@use './styles/detail.scss';
</style>
