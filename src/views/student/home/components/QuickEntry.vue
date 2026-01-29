<template>
  <section class="quick-entry-section">
    <div class="section-title">快速入口</div>
    <div class="quick-entry-grid">
      <div
        v-for="item in quickEntries"
        :key="item.id"
        class="entry-card"
        @click="handleClick(item.path)"
      >
        <div class="entry-icon" :style="{ background: item.color }">
          <el-icon :size="32">
            <component :is="item.icon" />
          </el-icon>
        </div>
        <div class="entry-title">{{ item.title }}</div>
        <div class="entry-desc">{{ item.description }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar,
  Location,
  Box,
  ChatDotRound
} from '@element-plus/icons-vue'
import { quickEntries as mockQuickEntries } from '@/mock/activities'

const router = useRouter()
const quickEntries = ref(mockQuickEntries)

const handleClick = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.quick-entry-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
}

.quick-entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.entry-card {
  background: white;
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
}

.entry-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
}

.entry-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.entry-desc {
  font-size: 14px;
  color: #666;
}
</style>
