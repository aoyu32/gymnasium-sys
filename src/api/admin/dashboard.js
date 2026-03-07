import request from '@/utils/request'

/**
 * 获取统计数据
 */
export function getStats() {
    return request({
        url: '/admin/dashboard/stats',
        method: 'get'
    })
}

/**
 * 获取全馆今日使用率
 */
export function getVenueUsage() {
    return request({
        url: '/admin/dashboard/venue-usage',
        method: 'get'
    })
}

/**
 * 获取器材损耗分析
 */
export function getEquipmentLoss() {
    return request({
        url: '/admin/dashboard/equipment-loss',
        method: 'get'
    })
}

/**
 * 获取近30天使用趋势
 */
export function getUsageTrend() {
    return request({
        url: '/admin/dashboard/usage-trend',
        method: 'get'
    })
}

/**
 * 获取活动类型分布
 */
export function getActivityTypeDistribution() {
    return request({
        url: '/admin/dashboard/activity-type',
        method: 'get'
    })
}
