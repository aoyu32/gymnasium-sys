import request from '@/utils/request'

/**
 * 获取场地负责人列表
 */
export function getManagerList(params) {
    return request({
        url: '/admin/managers',
        method: 'get',
        params
    })
}

/**
 * 获取场地负责人详情
 */
export function getManagerDetail(id) {
    return request({
        url: `/admin/managers/${id}`,
        method: 'get'
    })
}

/**
 * 添加场地负责人
 */
export function addManager(data) {
    return request({
        url: '/admin/managers',
        method: 'post',
        data
    })
}

/**
 * 更新场地负责人信息
 */
export function updateManager(id, data) {
    return request({
        url: `/admin/managers/${id}`,
        method: 'put',
        data
    })
}

/**
 * 删除场地负责人
 */
export function deleteManager(id) {
    return request({
        url: `/admin/managers/${id}`,
        method: 'delete'
    })
}

/**
 * 切换场地负责人状态
 */
export function toggleManagerStatus(id) {
    return request({
        url: `/admin/managers/${id}/toggle-status`,
        method: 'put'
    })
}
