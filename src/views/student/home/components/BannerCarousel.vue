<template>
  <section class="banner-section">
    <el-carousel height="400px" :interval="5000">
      <el-carousel-item v-for="item in banners" :key="item.id">
        <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
          <div class="banner-content">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
            <el-button type="primary" size="large" round>{{ item.buttonText }}</el-button>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { banners as mockBanners } from '@/mock/activities'

const banners = ref(mockBanners)
</script>

<style lang="scss" scoped>
.banner-section {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.banner-item {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
  }
}

.banner-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  
  h2 {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 20px;
    margin-bottom: 32px;
    opacity: 0.9;
  }
}
</style>
