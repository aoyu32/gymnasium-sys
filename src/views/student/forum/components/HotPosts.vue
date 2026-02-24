<template>
  <div class="hot-posts">
    <h3 class="hot-posts-title">
      <el-icon><TrendCharts /></el-icon>
      热门帖子
    </h3>
    <div class="hot-posts-list">
      <div
        v-for="(post, index) in hotPosts"
        :key="post.id"
        class="hot-post-item"
        @click="handleViewPost(post)"
      >
        <div class="hot-post-rank" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
        <div class="hot-post-content">
          <div class="hot-post-title">{{ post.title }}</div>
          <div class="hot-post-meta">
            <span><el-icon><View /></el-icon> {{ post.views }}</span>
            <span><el-icon><ChatDotRound /></el-icon> {{ post.comments }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrendCharts, View, ChatDotRound } from '@element-plus/icons-vue'

defineProps({
  hotPosts: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['view-post'])

const handleViewPost = (post) => {
  emit('view-post', post)
}
</script>

<style lang="scss" scoped>
.hot-posts {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .hot-posts-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 16px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid #f5f7fa;

    .el-icon {
      color: #f56c6c;
      font-size: 18px;
    }
  }

  .hot-posts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .hot-post-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #f5f7fa;
      }

      .hot-post-rank {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        background-color: #e4e7ed;
        color: #606266;

        &.rank-1 {
          background: linear-gradient(135deg, #f56c6c 0%, #e85d5d 100%);
          color: white;
        }

        &.rank-2 {
          background: linear-gradient(135deg, #e6a23c 0%, #d89b38 100%);
          color: white;
        }

        &.rank-3 {
          background: linear-gradient(135deg, #67c23a 0%, #5ab532 100%);
          color: white;
        }
      }

      .hot-post-content {
        flex: 1;
        min-width: 0;

        .hot-post-title {
          font-size: 14px;
          color: #303133;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.5;
        }

        .hot-post-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #909399;

          span {
            display: flex;
            align-items: center;
            gap: 4px;

            .el-icon {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
