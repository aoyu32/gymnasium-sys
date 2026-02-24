<template>
  <div class="student-forum">
    <div class="forum-container">
      <!-- 左侧：帖子浏览区 -->
      <div class="forum-main">
        <!-- 分类标签 -->
        <div class="category-tabs">
          <div
            v-for="item in categories"
            :key="item.value"
            class="category-item"
            :class="{ active: currentCategory === item.value }"
            @click="handleCategoryChange(item.value)"
          >
            {{ item.label }}
          </div>
        </div>

        <!-- 帖子列表 -->
        <PostList
          :posts="filteredPosts"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
import PostList from './components/PostList.vue'
import HotPosts from './components/HotPosts.vue'
import { posts } from '@/mock/posts'

const router = useRouter()
const currentCategory = ref('all')

const categories = [
  { label: '全部', value: 'all' },
  { label: '篮球', value: 'basketball' },
  { label: '足球', value: 'football' },
  { label: '羽毛球', value: 'badminton' },
  { label: '乒乓球', value: 'tabletennis' },
  { label: '网球', value: 'tennis' },
  { label: '排球', value: 'volleyball' },
  { label: '游泳', value: 'swimming' },
  { label: '健身', value: 'fitness' },
  { label: '跑步', value: 'running' },
  { label: '其他', value: 'other' }
]

// 筛选后的帖子列表
const filteredPosts = computed(() => {
  if (currentCategory.value === 'all') {
    return posts
  }
  return posts.filter(post => post.category === currentCategory.value)
})

// 热门帖子（按点赞数排序，取前5个）
const hotPosts = computed(() => {
  return [...posts]
    .filter(post => post.isHot)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)
})

const handleCategoryChange = (category) => {
  currentCategory.value = category
}

const handleLike = (post) => {
  post.likes++
  ElMessage.success('点赞成功')
}

const handleComment = (post) => {
  ElMessage.info('评论功能开发中')
}

const handleViewPost = (post) => {
  router.push(`/student/forum/${post.id}`)
}

const goToCreatePost = () => {
  console.log('Navigating to create post page...')
  router.push('/student/forum/create')
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
