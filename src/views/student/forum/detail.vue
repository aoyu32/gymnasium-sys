<template>
  <div class="forum-post-detail">
    <div v-if="post" class="detail-container">
      <!-- 帖子内容 -->
      <div class="post-main">
        <!-- 帖子卡片 -->
        <div class="post-card">
          <div class="post-header">
            <div class="author-info">
              <el-avatar :size="48" :src="post.authorAvatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="author-meta">
                <div class="author-name">{{ post.authorName }}</div>
                <div class="post-time">{{ post.createdAt }}</div>
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
              <span><el-icon><ChatDotRound /></el-icon> {{ post.commentsCount }}</span>
            </div>
            <div class="post-actions">
              <el-button @click="handleLike" :type="post.isLiked ? 'primary' : 'default'">
                <el-icon><Star /></el-icon>
                {{ post.isLiked ? '已点赞' : '点赞' }} {{ post.likes }}
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
              <el-avatar :size="40" :src="comment.userAvatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="comment-content">
                <div class="comment-header">
                  <div class="comment-info">
                    <span class="comment-author">{{ comment.userName }}</span>
                    <span class="comment-time">{{ comment.createdAt }}</span>
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
                    :placeholder="`回复 ${comment.userName}...`"
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
                    <el-avatar :size="32" :src="reply.userAvatar">
                      <el-icon><User /></el-icon>
                    </el-avatar>
                    <div class="reply-content">
                      <div class="reply-header">
                        <span class="reply-author">{{ reply.userName }}</span>
                        <span v-if="reply.parentUserName" class="reply-to">回复 {{ reply.parentUserName }}</span>
                        <span class="reply-time">{{ reply.createdAt }}</span>
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
import { marked } from 'marked'
import { getPostById, likePost, unlikePost, getPostComments, createComment, likeComment, unlikeComment, getPostPage } from '@/api/forum'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const commentContent = ref('')
const replyContent = ref('')
const replyingTo = ref(null)
const comments = ref([])
const hotPosts = ref([])
const loading = ref(false)

onMounted(async () => {
  await loadPost()
  await loadComments()
  await loadHotPosts()
})

// 加载帖子详情
const loadPost = async () => {
  try {
    loading.value = true
    const res = await getPostById(route.params.id)
    post.value = res.data
  } catch (error) {
    console.error('加载帖子失败:', error)
    ElMessage.error('加载帖子失败')
  } finally {
    loading.value = false
  }
}

// 加载评论列表
const loadComments = async () => {
  try {
    const res = await getPostComments(route.params.id)
    comments.value = res.data || []
  } catch (error) {
    console.error('加载评论失败:', error)
  }
}

// 加载热门帖子
const loadHotPosts = async () => {
  try {
    const res = await getPostPage({
      pageNum: 1,
      pageSize: 5,
      sortBy: 'likes',
      sortOrder: 'desc'
    })
    hotPosts.value = (res.data.records || []).slice(0, 5)
  } catch (error) {
    console.error('加载热门帖子失败:', error)
  }
}

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return marked(post.value.content)
})

const handleLike = async () => {
  if (!post.value) return
  
  try {
    if (post.value.isLiked) {
      await unlikePost(post.value.id)
      post.value.likes--
      post.value.isLiked = false
      ElMessage.success('已取消点赞')
    } else {
      await likePost(post.value.id)
      post.value.likes++
      post.value.isLiked = true
      ElMessage.success('点赞成功')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    ElMessage.error('操作失败')
  }
}

const handleSubmitComment = async () => {
  if (!commentContent.value.trim()) return
  
  try {
    await createComment({
      postId: parseInt(route.params.id),
      content: commentContent.value,
      parentId: null
    })
    
    commentContent.value = ''
    ElMessage.success('评论发表成功')
    
    // 重新加载评论列表
    await loadComments()
    
    // 更新帖子评论数
    if (post.value) {
      post.value.commentsCount++
    }
  } catch (error) {
    console.error('发表评论失败:', error)
    ElMessage.error(error.response?.data?.message || '发表评论失败')
  }
}

const handleReply = (comment) => {
  replyingTo.value = comment.id
  replyContent.value = ''
}

const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

const submitReply = async (comment) => {
  if (!replyContent.value.trim()) return
  
  try {
    await createComment({
      postId: parseInt(route.params.id),
      content: replyContent.value,
      parentId: comment.id
    })
    
    cancelReply()
    ElMessage.success('回复成功')
    
    // 重新加载评论列表
    await loadComments()
    
    // 更新帖子评论数
    if (post.value) {
      post.value.commentsCount++
    }
  } catch (error) {
    console.error('回复失败:', error)
    ElMessage.error(error.response?.data?.message || '回复失败')
  }
}

const handleLikeComment = async (comment) => {
  try {
    if (comment.isLiked) {
      await unlikeComment(comment.id)
      comment.likes--
      comment.isLiked = false
      ElMessage.success('已取消点赞')
    } else {
      await likeComment(comment.id)
      comment.likes++
      comment.isLiked = true
      ElMessage.success('点赞成功')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    ElMessage.error('操作失败')
  }
}

const goToPost = (post) => {
  router.push(`/student/forum/${post.id}`)
  window.location.reload()
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
