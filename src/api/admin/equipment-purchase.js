import request from '@/utils/request'

/**
 * 获取器材进货申请列表
 */
export function getPurchaseList(params) {
    return request({
        url: '/admin/equipment-purchases',
        method: 'get',
        params
    })
}

/**
 * 获取器材进货申请详情
 */
export function getPurchaseDetail(id) {
    return request({
        url: `/admin/equipment-purchases/${id}`,
        method: 'get'
    })
}

/**
 * 审批通过并入库
 */
export function approvePurchase(id) {
    return request({
        url: `/admin/equipment-purchases/${id}/approve`,
        method: 'put'
    })
}

/**
 * 拒绝申请
 */
export function rejectPurchase(id, data) {
    return request({
        url: `/admin/equipment-purchases/${id}/reject`,
        method: 'put',
        data
    })
}

/**
 * 删除申请记录
 */
export function deletePurchase(id) {
    return request({
        url: `/admin/equipment-purchases/${id}`,
        method: 'delete'
    })
}
