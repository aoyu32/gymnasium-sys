import request from '@/utils/request'

/**
 * 获取器材分类列表
 */
export function getCategoryList(params) {
    return request({
        url: '/admin/equipment-categories',
        method: 'get',
        params
    })
}

/**
 * 获取器材分类详情
 */
export function getCategoryDetail(id) {
    return request({
        url: `/admin/equipment-categories/${id}`,
        method: 'get'
    })
}

/**
 * 添加器材分类
 */
export function addCategory(data) {
    return request({
        url: '/admin/equipment-categories',
        method: 'post',
        data
    })
}

/**
 * 更新器材分类
 */
export function updateCategory(id, data) {
    return request({
        url: `/admin/equipment-categories/${id}`,
        method: 'put',
        data
    })
}

/**
 * 删除器材分类
 */
export function deleteCategory(id) {
    return request({
        url: `/admin/equipment-categories/${id}`,
        method: 'delete'
    })
}
