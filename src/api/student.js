import request from '@/utils/request'

/**
 * 获取当前学生信息
 */
export function getCurrentStudentInfo() {
    return request({
        url: '/students/current',
        method: 'get'
    })
}

/**
 * 更新学生信息
 */
export function updateStudentInfo(data) {
    return request({
        url: '/students/current',
        method: 'put',
        data
    })
}

/**
 * 修改密码
 */
export function changePassword(data) {
    return request({
        url: '/students/password',
        method: 'put',
        data
    })
}

/**
 * 更新头像
 */
export function updateAvatar(avatarUrl) {
    return request({
        url: '/students/avatar',
        method: 'post',
        params: { avatarUrl }
    })
}

/**
 * 获取我创建的活动的报名申请列表
 */
export function getMyActivityRegistrations(params) {
    return request({
        url: '/activity-registrations/my-activities',
        method: 'get',
        params
    })
}

/**
 * 审核活动报名
 */
export function approveActivityRegistration(activityId, userId, approved) {
    return request({
        url: `/activity-registrations/${activityId}/users/${userId}/approve`,
        method: 'put',
        params: { approved }
    })
}

/**
 * 取消已通过的报名
 */
export function cancelApprovedRegistration(activityId, userId) {
    return request({
        url: `/activity-registrations/${activityId}/users/${userId}/cancel-approval`,
        method: 'put'
    })
}

/**
 * 获取我报名的活动列表
 */
export function getMyRegistrations(params) {
    return request({
        url: '/activity-registrations/my',
        method: 'get',
        params
    })
}

/**
 * 取消活动报名
 */
export function cancelActivityRegistration(activityId) {
    return request({
        url: `/activity-registrations/${activityId}`,
        method: 'delete'
    })
}

/**
 * 获取我的场地申请记录
 */
export function getMyVenueApplications(params) {
    return request({
        url: '/applications/my',
        method: 'get',
        params
    })
}

/**
 * 取消场地申请
 */
export function cancelVenueApplication(id) {
    return request({
        url: `/applications/${id}/cancel`,
        method: 'delete'
    })
}

/**
 * 删除场地申请记录
 */
export function deleteVenueApplication(id) {
    return request({
        url: `/applications/${id}`,
        method: 'delete'
    })
}
