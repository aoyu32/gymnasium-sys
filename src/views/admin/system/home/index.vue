<template>
  <div class="system-home">
    <!-- 数据统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6f7ff;">
              <el-icon :size="32" color="#1890ff"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">学生总数</div>
              <div class="stat-value">{{ statsData.totalStudents }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff7e6;">
              <el-icon :size="32" color="#fa8c16"><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">场地负责人</div>
              <div class="stat-value">{{ statsData.totalManagers }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fffbe6;">
              <el-icon :size="32" color="#faad14"><Box /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">器材总数</div>
              <div class="stat-value">{{ statsData.totalEquipment }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f6ffed;">
              <el-icon :size="32" color="#52c41a"><ChatDotRound /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">论坛帖子</div>
              <div class="stat-value">{{ statsData.totalPosts }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16" class="charts-row">
      <!-- 全馆使用率 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>全馆今日使用率</span>
          </template>
          <div ref="venueUsageChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 器材损耗分析 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>器材损耗分析</span>
          </template>
          <div ref="equipmentLossChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="charts-row">
      <!-- 使用趋势报表 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>近30天使用趋势</span>
          </template>
          <div ref="usageTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 活动类型分布 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>活动类型分布</span>
          </template>
          <div ref="activityTypeChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { User, UserFilled, Box, ChatDotRound } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import {
  stats,
  venueUsageData,
  equipmentLossData,
  generateUsageTrendData,
  activityTypeData
} from '@/mock/dashboard'

const statsData = ref(stats)

// 图表实例
const venueUsageChart = ref(null)
const equipmentLossChart = ref(null)
const usageTrendChart = ref(null)
const activityTypeChart = ref(null)

let venueChart = null
let equipmentChart = null
let trendChart = null
let activityChart = null

// 初始化全馆使用率图表
const initVenueUsageChart = () => {
  venueChart = echarts.init(venueUsageChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c}%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: venueUsageData.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 30,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '使用率(%)',
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '使用率',
        type: 'bar',
        data: venueUsageData.map(item => ({
          value: item.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#1890ff' },
              { offset: 1, color: '#40a9ff' }
            ])
          }
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontSize: 12
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#096dd9' },
              { offset: 1, color: '#1890ff' }
            ])
          }
        }
      }
    ]
  }
  
  venueChart.setOption(option)
}

// 初始化器材损耗分析图表
const initEquipmentLossChart = () => {
  equipmentChart = echarts.init(equipmentLossChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: equipmentLossData.series.map(s => s.name),
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: equipmentLossData.categories,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value'
    },
    color: ['#52c41a', '#faad14', '#fa8c16', '#f5222d'],
    series: equipmentLossData.series.map(item => ({
      name: item.name,
      type: 'bar',
      stack: 'total',
      data: item.data,
      emphasis: {
        focus: 'series'
      }
    }))
  }
  
  equipmentChart.setOption(option)
}

// 初始化使用趋势图表
const initUsageTrendChart = () => {
  trendChart = echarts.init(usageTrendChart.value)
  
  const trendData = generateUsageTrendData()
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: trendData.series.map(s => s.name),
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.dates,
      axisLabel: {
        interval: 4
      }
    },
    yAxis: {
      type: 'value'
    },
    color: ['#1890ff', '#52c41a', '#faad14'],
    series: trendData.series.map(item => ({
      name: item.name,
      type: 'line',
      smooth: true,
      data: item.data,
      emphasis: {
        focus: 'series'
      }
    }))
  }
  
  trendChart.setOption(option)
}

// 初始化活动类型分布图表
const initActivityTypeChart = () => {
  activityChart = echarts.init(activityTypeChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}场 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        fontSize: 12
      }
    },
    color: ['#1890ff', '#52c41a', '#faad14', '#fa8c16', '#f5222d', '#722ed1', '#eb2f96', '#13c2c2', '#2f54eb', '#a0d911'],
    series: [
      {
        name: '活动类型',
        type: 'pie',
        radius: '65%',
        center: ['35%', '50%'],
        data: activityTypeData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          fontSize: 12
        }
      }
    ]
  }
  
  activityChart.setOption(option)
}

// 窗口大小改变时重新调整图表
const handleResize = () => {
  venueChart?.resize()
  equipmentChart?.resize()
  trendChart?.resize()
  activityChart?.resize()
}

onMounted(() => {
  // 延迟初始化，确保DOM已渲染
  setTimeout(() => {
    initVenueUsageChart()
    initEquipmentLossChart()
    initUsageTrendChart()
    initActivityTypeChart()
  }, 100)
  
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  venueChart?.dispose()
  equipmentChart?.dispose()
  trendChart?.dispose()
  activityChart?.dispose()
})
</script>

<style lang="scss" scoped>
@use './styles/index.scss';
</style>
