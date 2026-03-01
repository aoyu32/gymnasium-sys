import request from '@/utils/request'

/**
 * 提交场地申请
 */
export function submitApplication(data) {
    return request({
        url: '/applications',
        method: 'post',
        data
    })
}

/**
 * 查询我的申请记录
 */
export function getMyApplications(params) {
    return request({
        url: '/applications/my',
        method: 'get',
        params
    })
}

/**
 * 查询申请详情
 */
export function getApplicationById(id) {
    return request({
        url: `/applications/${id}`,
        method: 'get'
    })
}

/**
 * 取消申请
 */
export function cancelApplication(id) {
    return request({
        url: `/applications/${id}/cancel`,
        method: 'delete'
    })
}

/**
 * 删除申请记录
 */
export function deleteApplication(id) {
    return request({
        url: `/applications/${id}`,
        method: 'delete'
    })
}

/**
 * 审批申请（场地负责人）
 */
export function approveApplication(id, approved, rejectReason) {
    return request({
        url: `/applications/${id}/approve`,
        method: 'put',
        params: {
            approved,
            rejectReason
        }
    })
}

/**
 * 查询所有申请记录（场地负责人）
 */
export function getAllApplications(params) {
    return request({
        url: '/applications',
        method: 'get',
        params
    })
}
