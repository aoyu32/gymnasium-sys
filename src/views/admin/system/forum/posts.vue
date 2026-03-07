<template>
  <div class="system-forum-posts">
    <el-card>
      <template #header>
        <span>帖子信息管理</span>
      </template>

      <!-- 搜索筛选 -->
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索帖子标题或作者"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterCategory" placeholder="分类" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.name"
          />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="正常" value="normal" />
          <el-option label="已下架" value="hidden" />
        </el-select>
        <el-select v-model="filterHot" placeholder="热门" clearable style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="热门" value="true" />
          <el-option label="普通" value="false" />
        </el-select>
      </div>

      <!-- 帖子列表 -->
      <el-table :data="paginatedPosts" stripe style="margin-top: 20px">
        <el-table-column prop="title" label="帖子标题" min-width="250" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" min-width="100" />
        <el-table-column prop="category" label="分类" min-width="100" />
        <el-table-column prop="views" label="浏览量" min-width="100" align="center" />
        <el-table-column prop="comments" label="评论数" min-width="100" align="center" />
        <el-table-column prop="likes" label="点赞数" min-width="100" align="center" />
        <el-table-column prop="isHot" label="热门" min-width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isHot" type="danger" size="small">热门</el-tag>
            <span v-else style="color: #999;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'normal'" type="success">正常</el-tag>
            <el-tag v-else type="warning">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" min-width="160" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
            <el-button link type="warning" size="small" @click="handleToggleHot(row)">
              {{ row.isHot ? '取消热门' : '设为热门' }}
            </el-button>
            <el-button link type="warning" size="small" @click="handleToggleStatus(row)">
              {{ row.status === 'normal' ? '下架' : '上架' }}
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredPosts.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 帖子详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="帖子详情"
      width="900px"
    >
      <div v-if="currentPost" class="post-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="帖子标题" :span="2">{{ currentPost.title }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ currentPost.author }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ currentPost.category }}</el-descriptions-item>
          <el-descriptions-item label="浏览量">{{ currentPost.views }}</el-descriptions-item>
          <el-descriptions-item label="评论数">{{ currentPost.comments }}</el-descriptions-item>
          <el-descriptions-item label="点赞数">{{ currentPost.likes }}</el-descriptions-item>
          <el-descriptions-item label="热门">
            <el-tag v-if="currentPost.isHot" type="danger" size="small">热门</el-tag>
            <span v-else>否</span>
          </el-descriptions-item>
          <el-descriptions-item label="状态" :span="2">
            <el-tag v-if="currentPost.status === 'normal'" type="success">正常</el-tag>
            <el-tag v-else type="warning">已下架</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发布时间" :span="2">{{ currentPost.createTime }}</el-descriptions-item>
          <el-descriptions-item label="帖子摘要" :span="2">
            <div class="summary-content">{{ currentPost.summary }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="帖子内容" :span="2">
            <div class="content-preview">{{ currentPost.content }}</div>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentPost.images?.length" label="图片" :span="2">
            <div class="images-preview">
              <el-image
                v-for="(img, index) in currentPost.images"
                :key="index"
                :src="img"
                :preview-src-list="currentPost.images"
                :initial-index="index"
                fit="cover"
                style="width: 100px; height: 100px; margin-right: 10px; border-radius: 4px;"
              />
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button v-if="currentPost?.isHot" type="warning" @click="handleToggleHotFromDetail">取消热门</el-button>
        <el-button v-else type="warning" @click="handleToggleHotFromDetail">设为热门</el-button>
        <el-button v-if="currentPost?.status === 'normal'" type="warning" @click="handleToggleStatusFromDetail">下架</el-button>
        <el-button v-else type="success" @click="handleToggleStatusFromDetail">上架</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getAllPosts, getPostById, toggleHot, toggleStatus, deletePost, getAllCategories } from '@/api/admin/forum'

const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const filterHot = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const detailDialogVisible = ref(false)
const currentPost = ref(null)
const allPosts = ref([])
const loading = ref(false)
const categories = ref([])

// 加载分类列表
const loadCategories = async () => {
  try {
    const res = await getAllCategories()
    categories.value = res.data || []
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 加载帖子列表
const loadPosts = async () => {
  loading.value = true
  try {
    const res = await getAllPosts({
      pageNum: 1,
      pageSize: 1000, // 加载所有数据，前端分页
      sortBy: 'created_at',
      sortOrder: 'desc'
    })
    allPosts.value = (res.data.records || []).map(post => ({
      id: post.id,
      title: post.title,
      author: post.authorName,
      category: post.categoryName,
      summary: post.summary,
      content: post.content,
      images: post.images || [],
      views: post.views,
      comments: post.commentsCount,
      likes: post.likes,
      isHot: post.isHot,
      status: post.status,
      createTime: post.createdAt
    }))
  } catch (error) {
    console.error('加载帖子失败:', error)
    ElMessage.error('加载帖子失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
  loadPosts()
})

const filteredPosts = computed(() => {
  let result = [...allPosts.value]
  
  if (searchKeyword.value) {
    result = result.filter(p => 
      p.title.includes(searchKeyword.value) || 
      p.author.includes(searchKeyword.value)
    )
  }
  
  if (filterCategory.value) {
    result = result.filter(p => p.category === filterCategory.value)
  }

  if (filterStatus.value) {
    result = result.filter(p => p.status === filterStatus.value)
  }

  if (filterHot.value) {
    const isHot = filterHot.value === 'true'
    result = result.filter(p => p.isHot === isHot)
  }
  
  return result
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredPosts.value.slice(start, start + pageSize.value)
})

const handleViewDetail = async (row) => {
  try {
    const res = await getPostById(row.id)
    currentPost.value = {
      id: res.data.id,
      title: res.data.title,
      author: res.data.authorName,
      category: res.data.categoryName,
      summary: res.data.summary,
      content: res.data.content,
      images: res.data.images || [],
      views: res.data.views,
      comments: res.data.commentsCount,
      likes: res.data.likes,
      isHot: res.data.isHot,
      status: res.data.status,
      createTime: res.data.createdAt
    }
    detailDialogVisible.value = true
  } catch (error) {
    console.error('获取帖子详情失败:', error)
    ElMessage.error('获取帖子详情失败')
  }
}

const handleToggleHot = async (row) => {
  const newIsHot = !row.isHot
  try {
    await toggleHot(row.id, newIsHot)
    row.isHot = newIsHot
    ElMessage.success(newIsHot ? '已设为热门' : '已取消热门')
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

const handleToggleHotFromDetail = async () => {
  if (currentPost.value) {
    await handleToggleHot(currentPost.value)
    // 更新列表中的数据
    const post = allPosts.value.find(p => p.id === currentPost.value.id)
    if (post) {
      post.isHot = currentPost.value.isHot
    }
  }
}

const handleToggleStatus = async (row) => {
  const newStatus = row.status === 'normal' ? 'hidden' : 'normal'
  
  try {
    await ElMessageBox.confirm(
      `确定${newStatus === 'normal' ? '上架' : '下架'}该帖子吗？${newStatus === 'hidden' ? '下架后学生将无法查看该帖子。' : ''}`,
      '提示',
      { type: 'warning' }
    )
    
    await toggleStatus(row.id, newStatus)
    row.status = newStatus
    ElMessage.success(newStatus === 'normal' ? '已上架' : '已下架')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const handleToggleStatusFromDetail = async () => {
  if (currentPost.value) {
    detailDialogVisible.value = false
    await handleToggleStatus(currentPost.value)
    // 更新列表中的数据
    const post = allPosts.value.find(p => p.id === currentPost.value.id)
    if (post) {
      post.status = currentPost.value.status
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该帖子吗？删除后将无法恢复。', '提示', {
      type: 'warning'
    })
    
    await deletePost(row.id)
    const index = allPosts.value.findIndex(p => p.id === row.id)
    if (index !== -1) {
      allPosts.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}
</script>

<style lang="scss" scoped>
@use './styles/posts.scss';
</style>
