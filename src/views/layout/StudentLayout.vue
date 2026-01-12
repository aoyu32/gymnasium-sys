<template>
  <div class="student-layout">
    <StudentHeader />
    <div class="student-main">
      <router-view />
    </div>
    <StudentFooter />
  </div>
</template>

<script setup>
import StudentHeader from './components/StudentHeader.vue'
import StudentFooter from './components/StudentFooter.vue'
</script>

<style lang="scss" scoped>
@use './styles/StudentLayout.scss';
</style>
