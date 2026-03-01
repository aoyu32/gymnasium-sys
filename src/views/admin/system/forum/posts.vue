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
          <el-option label="篮球" value="篮球" />
          <el-option label="足球" value="足球" />
          <el-option label="羽毛球" value="羽毛球" />
          <el-option label="乒乓球" value="乒乓球" />
          <el-option label="网球" value="网球" />
          <el-option label="游泳" value="游泳" />
          <el-option label="健身" value="健身" />
          <el-option label="跑步" value="跑步" />
          <el-option label="其他" value="其他" />
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
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const filterHot = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const detailDialogVisible = ref(false)
const currentPost = ref(null)

const allPosts = ref([
  {
    id: 1,
    title: '分享一下我的篮球训练心得',
    author: '张三',
    category: '篮球',
    summary: '最近坚持每天练习投篮，终于有了明显进步。分享几个小技巧给大家。',
    content: '最近坚持每天练习投篮，终于有了明显进步。分享几个小技巧给大家：\n\n1. 保持正确的投篮姿势 - 双脚与肩同宽，膝盖微曲\n2. 每天至少练习100次 - 坚持是关键\n3. 注意手腕的发力 - 手腕要有弹性\n4. 多看职业球员的投篮视频学习 - 模仿是最好的学习方式\n\n希望对大家有帮助！',
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400'
    ],
    views: 328,
    comments: 25,
    likes: 68,
    isHot: true,
    status: 'normal',
    createTime: '2026-02-24 12:30'
  },
  {
    id: 2,
    title: '羽毛球新手入门指南',
    author: '李四',
    category: '羽毛球',
    summary: '作为一个羽毛球爱好者，整理了一些新手常见问题和解决方法。',
    content: '作为一个羽毛球爱好者，整理了一些新手常见问题和解决方法。包括握拍方式、基本步法、发球技巧等内容。',
    images: [],
    views: 456,
    comments: 38,
    likes: 92,
    isHot: true,
    status: 'normal',
    createTime: '2026-02-24 09:30'
  },
  {
    id: 3,
    title: '足球场上的团队配合技巧',
    author: '王五',
    category: '足球',
    summary: '足球是一项团队运动，良好的配合至关重要。',
    content: '足球是一项团队运动，良好的配合至关重要。今天和大家分享一些实用的配合技巧和战术理解。',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400'
    ],
    views: 289,
    comments: 19,
    likes: 54,
    isHot: true,
    status: 'normal',
    createTime: '2026-02-23 14:30'
  },
  {
    id: 4,
    title: '健身房新手避坑指南',
    author: '赵六',
    category: '健身',
    summary: '刚开始健身的朋友们注意了！这些常见错误一定要避免。',
    content: '刚开始健身的朋友们注意了！这些常见错误一定要避免，否则不仅效果不好，还可能受伤。',
    images: [],
    views: 512,
    comments: 42,
    likes: 108,
    isHot: true,
    status: 'normal',
    createTime: '2026-02-23 10:15'
  },
  {
    id: 5,
    title: '晨跑的正确打开方式',
    author: '孙七',
    category: '跑步',
    summary: '坚持晨跑一个月了，分享一些心得体会。',
    content: '坚持晨跑一个月了，分享一些心得体会。包括跑前热身、跑步节奏、跑后拉伸等注意事项。',
    images: [
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400'
    ],
    views: 234,
    comments: 16,
    likes: 45,
    isHot: false,
    status: 'normal',
    createTime: '2026-02-22 07:00'
  },
  {
    id: 6,
    title: '游泳初学者的安全注意事项',
    author: '周八',
    category: '游泳',
    summary: '游泳是一项很好的运动，但安全第一。',
    content: '游泳是一项很好的运动，但安全第一。分享一些初学者需要注意的安全事项。',
    images: [],
    views: 178,
    comments: 12,
    likes: 32,
    isHot: false,
    status: 'hidden',
    createTime: '2026-02-21 15:20'
  },
  {
    id: 7,
    title: '乒乓球发球技巧详解',
    author: '吴九',
    category: '乒乓球',
    summary: '发球是乒乓球比赛中的重要环节。',
    content: '发球是乒乓球比赛中的重要环节，掌握好发球技巧可以占据主动。',
    images: [],
    views: 145,
    comments: 8,
    likes: 28,
    isHot: false,
    status: 'normal',
    createTime: '2026-02-20 11:45'
  }
])

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

const handleViewDetail = (row) => {
  currentPost.value = row
  detailDialogVisible.value = true
}

const handleToggleHot = (row) => {
  row.isHot = !row.isHot
  ElMessage.success(row.isHot ? '已设为热门' : '已取消热门')
}

const handleToggleHotFromDetail = () => {
  if (currentPost.value) {
    handleToggleHot(currentPost.value)
  }
}

const handleToggleStatus = (row) => {
  const newStatus = row.status === 'normal' ? 'hidden' : 'normal'
  
  ElMessageBox.confirm(
    `确定${newStatus === 'normal' ? '上架' : '下架'}该帖子吗？${newStatus === 'hidden' ? '下架后学生将无法查看该帖子。' : ''}`,
    '提示',
    { type: 'warning' }
  ).then(() => {
    row.status = newStatus
    ElMessage.success(newStatus === 'normal' ? '已上架' : '已下架')
  }).catch(() => {})
}

const handleToggleStatusFromDetail = () => {
  if (currentPost.value) {
    detailDialogVisible.value = false
    handleToggleStatus(currentPost.value)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该帖子吗？删除后将无法恢复。', '提示', {
    type: 'warning'
  }).then(() => {
    const index = allPosts.value.findIndex(p => p.id === row.id)
    if (index !== -1) {
      allPosts.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
@use './styles/posts.scss';
</style>
