import request from '@/utils/request'

// ============================================
// 活动信息管理接口
// ============================================

/**
 * 创建活动
 */
export function createActivity(data) {
    return request({
        url: '/activities',
        method: 'post',
        data
    })
}

/**
 * 更新活动
 */
export function updateActivity(id, data) {
    return request({
        url: `/activities/${id}`,
        method: 'put',
        data
    })
}

/**
 * 删除活动
 */
export function deleteActivity(id) {
    return request({
        url: `/activities/${id}`,
        method: 'delete'
    })
}

/**
 * 查询活动详情
 */
export function getActivityById(id) {
    return request({
        url: `/activities/${id}`,
        method: 'get'
    })
}

/**
 * 查询活动列表
 */
export function getActivityPage(params) {
    return request({
        url: '/activities',
        method: 'get',
        params
    })
}

/**
 * 审核活动（场地负责人）
 */
export function approveActivity(id, approved) {
    return request({
        url: `/activities/${id}/approve`,
        method: 'put',
        params: { approved }
    })
}

/**
 * 查询我创建的活动
 */
export function getMyActivities(params) {
    return request({
        url: '/activities/my',
        method: 'get',
        params
    })
}

// ============================================
// 活动报名管理接口
// ============================================

/**
 * 报名参加活动
 */
export function registerActivity(activityId, reason) {
    return request({
        url: `/activity-registrations/${activityId}`,
        method: 'post',
        params: { reason }
    })
}

/**
 * 取消报名
 */
export function cancelRegistration(activityId) {
    return request({
        url: `/activity-registrations/${activityId}`,
        method: 'delete'
    })
}

/**
 * 审核活动报名（活动创建者）
 */
export function approveRegistration(activityId, userId, approved) {
    return request({
        url: `/activity-registrations/${activityId}/users/${userId}/approve`,
        method: 'put',
        params: { approved }
    })
}

/**
 * 查询我报名的活动
 */
export function getMyRegistrations(params) {
    return request({
        url: '/activity-registrations/my',
        method: 'get',
        params
    })
}
