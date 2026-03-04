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
            :total="searchResults.activityTotal"
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
            :total="searchResults.venueTotal"
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
            :total="searchResults.equipmentTotal"
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
import { ElMessage } from 'element-plus'
import SearchHeader from './components/SearchHeader.vue'
import ResultList from './components/ResultList.vue'
import { search } from '@/api/search'

const router = useRouter()
const route = useRoute()

const searchKeyword = ref('')
const activeTab = ref('activities')
const currentPage = ref(1)
const pageSize = ref(12)
const loading = ref(false)

// 搜索结果
const searchResults = ref({
  activities: [],
  activityTotal: 0,
  venues: [],
  venueTotal: 0,
  equipments: [],
  equipmentTotal: 0
})

onMounted(() => {
  // 从URL参数获取搜索关键词
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword
    performSearch()
  }
})

// 监听路由变化
watch(() => route.query.keyword, (newKeyword) => {
  if (newKeyword) {
    searchKeyword.value = newKeyword
    currentPage.value = 1
    performSearch()
  }
})

// 监听tab切换
watch(activeTab, () => {
  currentPage.value = 1
  performSearch()
})

// 监听分页变化
watch(currentPage, () => {
  performSearch()
})

// 执行搜索
const performSearch = async () => {
  if (!searchKeyword.value) {
    return
  }
  
  loading.value = true
  try {
    const typeMap = {
      activities: 'activity',
      venues: 'venue',
      equipments: 'equipment'
    }
    
    const res = await search({
      keyword: searchKeyword.value,
      type: typeMap[activeTab.value],
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    
    // 转换活动数据格式
    const activities = (res.data.activities || []).map(item => ({
      ...item,
      time: formatDateTime(item.activityTime),
      venue: item.venueName || item.areaName || '待定',
      participants: item.currentParticipants
    }))
    
    searchResults.value = {
      activities: activities,
      activityTotal: res.data.activityTotal || 0,
      venues: res.data.venues || [],
      venueTotal: res.data.venueTotal || 0,
      equipments: res.data.equipments || [],
      equipmentTotal: res.data.equipmentTotal || 0
    }
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 搜索过滤（使用后端返回的数据）
const filteredActivities = computed(() => searchResults.value.activities || [])
const filteredVenues = computed(() => searchResults.value.venues || [])
const filteredEquipments = computed(() => searchResults.value.equipments || [])

// 分页数据（后端已分页，直接使用）
const paginatedActivities = computed(() => filteredActivities.value)
const paginatedVenues = computed(() => filteredVenues.value)
const paginatedEquipments = computed(() => filteredEquipments.value)

const handleSearch = () => {
  currentPage.value = 1
  // 更新URL参数
  router.push({
    path: '/student/search',
    query: { keyword: searchKeyword.value }
  })
  performSearch()
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
