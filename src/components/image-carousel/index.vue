<template>
  <div class="image-carousel">
    <el-carousel
      :height="height"
      :interval="interval"
      :arrow="arrow"
      indicator-position="none"
    >
      <el-carousel-item v-for="(image, index) in images" :key="index">
        <img :src="image" :alt="`图片${index + 1}`" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>
    <!-- 自定义指示器 -->
    <div class="custom-indicators">
      <span class="indicator-text">{{ currentIndex + 1 }} / {{ images.length }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  height: {
    type: String,
    default: '400px'
  },
  interval: {
    type: Number,
    default: 5000
  },
  arrow: {
    type: String,
    default: 'hover',
    validator: (value) => ['always', 'hover', 'never'].includes(value)
  }
})

const currentIndex = ref(0)
let carouselElement = null

onMounted(() => {
  // 监听轮播图切换事件
  const carousel = document.querySelector('.image-carousel .el-carousel')
  if (carousel) {
    carouselElement = carousel
    const observer = new MutationObserver(() => {
      const activeItem = carousel.querySelector('.el-carousel__item.is-active')
      if (activeItem) {
        const items = Array.from(carousel.querySelectorAll('.el-carousel__item'))
        currentIndex.value = items.indexOf(activeItem)
      }
    })
    
    observer.observe(carousel, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    })
  }
})

onBeforeUnmount(() => {
  carouselElement = null
})
</script>

<style lang="scss" scoped>
.image-carousel {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :deep(.el-carousel__container) {
    height: 100%;
  }

  :deep(.el-carousel__arrow) {
    background-color: rgba(0, 0, 0, 0.3);
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  .custom-indicators {
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 10;
    
    .indicator-text {
      display: inline-block;
      padding: 6px 12px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      font-size: 14px;
      border-radius: 4px;
      backdrop-filter: blur(4px);
    }
  }
}
</style>
