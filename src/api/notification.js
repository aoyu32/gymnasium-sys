import request from '@/utils/request'

/**
 * 分页查询我的消息
 */
export function getNotificationPage(params) {
    return request({
        url: '/notifications',
        method: 'get',
        params
    })
}

/**
 * 查询未读消息数量
 */
export function getUnreadNotificationCount() {
    return request({
        url: '/notifications/unread-count',
        method: 'get'
    })
}

/**
 * 标记单条消息已读
 */
export function markNotificationRead(id) {
    return request({
        url: `/notifications/${id}/read`,
        method: 'put'
    })
}

/**
 * 删除单条消息
 */
export function deleteNotification(id) {
    return request({
        url: `/notifications/${id}`,
        method: 'delete'
    })
}

/**
 * 全部标记已读
 */
export function markAllNotificationsRead() {
    return request({
        url: '/notifications/read-all',
        method: 'put'
    })
}
