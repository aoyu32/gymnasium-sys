<template>
  <div class="student-forum">
    <div class="forum-container">
      <!-- 左侧：帖子浏览区 -->
      <div class="forum-main">
        <!-- 分类标签 -->
        <div class="category-tabs">
          <div
            v-for="item in categories"
            :key="item.id"
            class="category-item"
            :class="{ active: currentCategory === item.id }"
            @click="handleCategoryChange(item.id)"
          >
            {{ item.name }}
          </div>
        </div>

        <!-- 帖子列表 -->
        <PostList
          v-loading="loading"
          :posts="posts"
          @like="handleLike"
          @comment="handleComment"
          @view-post="handleViewPost"
        />
      </div>

      <!-- 右侧：侧边栏 -->
      <div class="forum-sidebar">
        <!-- 发布帖子按钮 -->
        <div class="publish-card">
          <el-button type="primary" size="large" style="width: 100%" @click="goToCreatePost">
            <el-icon><Edit /></el-icon>
            发布帖子
          </el-button>
        </div>

        <!-- 热门帖子 -->
        <HotPosts :hot-posts="hotPosts" @view-post="handleViewPost" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import PostList from './components/PostList.vue'
import HotPosts from './components/HotPosts.vue'
import { getPostPage, getAllCategories, likePost, unlikePost } from '@/api/forum'

const router = useRouter()
const currentCategory = ref(null)
const categories = ref([])
const posts = ref([])
const loading = ref(false)

// 加载分类
const loadCategories = async () => {
  try {
    const res = await getAllCategories()
    categories.value = [
      { id: null, name: '全部' },
      ...(res.data || [])
    ]
  } catch (error) {
    console.error('加载分类失败:', error)
    ElMessage.error('加载分类失败')
  }
}

// 加载帖子列表
const loadPosts = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: 1,
      pageSize: 50,
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
    
    if (currentCategory.value) {
      params.categoryId = currentCategory.value
    }
    
    const res = await getPostPage(params)
    posts.value = (res.data.records || []).map(post => ({
      ...post,
      category: post.categoryName,
      author: post.authorName,
      avatar: post.authorAvatar,
      time: post.createdAt,
      comments: post.commentsCount,
      summary: post.summary || post.title
    }))
  } catch (error) {
    console.error('加载帖子失败:', error)
    ElMessage.error('加载帖子失败')
  } finally {
    loading.value = false
  }
}

// 热门帖子（按点赞数排序，取前5个）
const hotPosts = computed(() => {
  return [...posts.value]
    .filter(post => post.isHot)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)
})

const handleCategoryChange = (categoryId) => {
  currentCategory.value = categoryId
  loadPosts()
}

const handleLike = async (post) => {
  try {
    if (post.isLiked) {
      await unlikePost(post.id)
      post.likes--
      post.isLiked = false
      ElMessage.success('已取消点赞')
    } else {
      await likePost(post.id)
      post.likes++
      post.isLiked = true
      ElMessage.success('点赞成功')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    ElMessage.error('操作失败')
  }
}

const handleComment = (post) => {
  router.push(`/student/forum/${post.id}`)
}

const handleViewPost = (post) => {
  router.push(`/student/forum/${post.id}`)
}

const goToCreatePost = () => {
  router.push('/student/forum/create')
}

onMounted(() => {
  loadCategories()
  loadPosts()
})
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
