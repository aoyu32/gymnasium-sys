import request from '@/utils/request'

/**
 * 分页查询所有帖子
 */
export function getAllPosts(params) {
    return request({
        url: '/admin/forum/posts',
        method: 'get',
        params
    })
}

/**
 * 获取帖子详情
 */
export function getPostById(id) {
    return request({
        url: `/admin/forum/posts/${id}`,
        method: 'get'
    })
}

/**
 * 设置/取消热门帖子
 */
export function toggleHot(id, isHot) {
    return request({
        url: `/admin/forum/posts/${id}/hot`,
        method: 'put',
        params: { isHot }
    })
}

/**
 * 上架/下架帖子
 */
export function toggleStatus(id, status) {
    return request({
        url: `/admin/forum/posts/${id}/status`,
        method: 'put',
        params: { status }
    })
}

/**
 * 删除帖子
 */
export function deletePost(id) {
    return request({
        url: `/admin/forum/posts/${id}`,
        method: 'delete'
    })
}

/**
 * 获取所有分类
 */
export function getAllCategories() {
    return request({
        url: '/forum/categories',
        method: 'get'
    })
}
