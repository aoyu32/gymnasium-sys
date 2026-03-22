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
import banner1 from '@/assets/banners/banner1.jfif'
import banner2 from '@/assets/banners/banner2.jfif'
import banner3 from '@/assets/banners/banner3.jfif'
const banners = [
  {
    id: 1,
    title: '欢迎使用体育馆管理系统',
    description: '在线预约场地，轻松借用器材',
    buttonText: '立即体验',
    image: banner1
  },
  {
    id: 2,
    title: '校园篮球赛报名中',
    description: '展现你的运动风采',
    buttonText: '马上报名',
    image: banner2
  },
  {
    id: 3,
    title: '体育论坛上线',
    description: '分享运动心得，结识运动伙伴',
    buttonText: '去看看',
    image: banner3
  }
]
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
