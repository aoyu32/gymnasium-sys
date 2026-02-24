<template>
  <div class="student-search">
    <div class="search-container">
      <!-- 搜索框组件 -->
      <SearchHeader v-model="searchKeyword" @search="handleSearch" />

      <!-- Tab栏 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="活动" name="activities">
          <ResultList
            type="activity"
            :items="paginatedActivities"
            :total="filteredActivities.length"
            :page-size="pageSize"
            :current-page="currentPage"
            empty-text="未找到相关活动"
            @view-item="goToActivityDetail"
            @update:current-page="currentPage = $event"
          />
        </el-tab-pane>

        <el-tab-pane label="场地" name="venues">
          <ResultList
            type="venue"
            :items="paginatedVenues"
            :total="filteredVenues.length"
            :page-size="pageSize"
            :current-page="currentPage"
            empty-text="未找到相关场地"
            @view-item="goToVenueDetail"
            @update:current-page="currentPage = $event"
          />
        </el-tab-pane>

        <el-tab-pane label="器材" name="equipments">
          <ResultList
            type="equipment"
            :items="paginatedEquipments"
            :total="filteredEquipments.length"
            :page-size="pageSize"
            :current-page="currentPage"
            empty-text="未找到相关器材"
            @view-item="goToEquipmentDetail"
            @update:current-page="currentPage = $event"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SearchHeader from './components/SearchHeader.vue'
import ResultList from './components/ResultList.vue'
import { activities } from '@/mock/activities'
import { venues } from '@/mock/venues'
import { equipments } from '@/mock/equipments'

const router = useRouter()
const route = useRoute()

const searchKeyword = ref('')
const activeTab = ref('activities')
const currentPage = ref(1)
const pageSize = ref(12)

onMounted(() => {
  // 从URL参数获取搜索关键词
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword
  }
})

// 监听路由变化
watch(() => route.query.keyword, (newKeyword) => {
  if (newKeyword) {
    searchKeyword.value = newKeyword
    currentPage.value = 1
  }
})

// 搜索过滤
const filteredActivities = computed(() => {
  if (!searchKeyword.value) return []
  const keyword = searchKeyword.value.toLowerCase()
  return activities.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.location.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword)
  )
})

const filteredVenues = computed(() => {
  if (!searchKeyword.value) return []
  const keyword = searchKeyword.value.toLowerCase()
  return venues.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.location.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword)
  )
})

const filteredEquipments = computed(() => {
  if (!searchKeyword.value) return []
  const keyword = searchKeyword.value.toLowerCase()
  return equipments.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword)
  )
})

// 分页数据
const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredActivities.value.slice(start, end)
})

const paginatedVenues = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredVenues.value.slice(start, end)
})

const paginatedEquipments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredEquipments.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
  // 更新URL参数
  router.push({
    path: '/student/search',
    query: { keyword: searchKeyword.value }
  })
}

const handleTabChange = () => {
  currentPage.value = 1
}

const goToActivityDetail = (id) => {
  router.push(`/student/activities/${id}`)
}

const goToVenueDetail = (id) => {
  router.push(`/student/venue-apply/${id}`)
}

const goToEquipmentDetail = (id) => {
  router.push(`/student/equipment/${id}`)
}
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
