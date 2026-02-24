<template>
  <div class="post-list">
    <div v-if="posts.length > 0" class="posts-container">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @like="handleLike"
        @comment="handleComment"
        @click="handleViewPost"
      />
    </div>
    <el-empty v-else description="暂无帖子" />
  </div>
</template>

<script setup>
import PostCard from '@/components/post-card/index.vue'

defineProps({
  posts: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['like', 'comment', 'view-post'])

const handleLike = (post) => {
  emit('like', post)
}

const handleComment = (post) => {
  emit('comment', post)
}

const handleViewPost = (post) => {
  emit('view-post', post)
}
</script>

<style lang="scss" scoped>
.post-list {
  .posts-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
