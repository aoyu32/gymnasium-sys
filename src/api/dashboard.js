import request from '@/utils/request'

/**
 * 获取工作台统计数据
 */
export function getStats() {
    return request({
        url: '/dashboard/stats',
        method: 'get'
    })
}

/**
 * 获取待处理事项列表
 */
export function getPendingTasks() {
    return request({
        url: '/dashboard/pending-tasks',
        method: 'get'
    })
}

/**
 * 获取今日场地使用情况
 */
export function getTodayVenues() {
    return request({
        url: '/dashboard/today-venues',
        method: 'get'
    })
}

/**
 * 获取器材借还提醒
 */
export function getEquipmentReminders() {
    return request({
        url: '/dashboard/equipment-reminders',
        method: 'get'
    })
}

/**
 * 获取本周热门活动
 */
export function getHotActivities() {
    return request({
        url: '/dashboard/hot-activities',
        method: 'get'
    })
}
