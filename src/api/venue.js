import request from '@/utils/request'

/**
 * 分页查询场地列表
 */
export function getVenuePage(params) {
    return request({
        url: '/venues',
        method: 'get',
        params
    })
}

/**
 * 查询场地详情
 */
export function getVenueById(id) {
    return request({
        url: `/venues/${id}`,
        method: 'get'
    })
}

/**
 * 添加场地
 */
export function addVenue(data) {
    return request({
        url: '/venues',
        method: 'post',
        data
    })
}

/**
 * 更新场地
 */
export function updateVenue(id, data) {
    return request({
        url: `/venues/${id}`,
        method: 'put',
        data
    })
}

/**
 * 删除场地
 */
export function deleteVenue(id) {
    return request({
        url: `/venues/${id}`,
        method: 'delete'
    })
}
