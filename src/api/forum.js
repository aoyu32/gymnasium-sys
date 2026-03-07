import request from '@/utils/request'

/**
 * 创建帖子
 */
export function createPost(data) {
    return request({
        url: '/forum/posts',
        method: 'post',
        data
    })
}

/**
 * 更新帖子
 */
export function updatePost(id, data) {
    return request({
        url: `/forum/posts/${id}`,
        method: 'put',
        data
    })
}

/**
 * 删除帖子
 */
export function deletePost(id) {
    return request({
        url: `/forum/posts/${id}`,
        method: 'delete'
    })
}

/**
 * 获取帖子详情
 */
export function getPostById(id) {
    return request({
        url: `/forum/posts/${id}`,
        method: 'get'
    })
}

/**
 * 分页查询帖子
 */
export function getPostPage(params) {
    return request({
        url: '/forum/posts',
        method: 'get',
        params
    })
}

/**
 * 点赞帖子
 */
export function likePost(id) {
    return request({
        url: `/forum/posts/${id}/like`,
        method: 'post'
    })
}

/**
 * 取消点赞帖子
 */
export function unlikePost(id) {
    return request({
        url: `/forum/posts/${id}/like`,
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

/**
 * 创建评论
 */
export function createComment(data) {
    return request({
        url: '/forum/comments',
        method: 'post',
        data
    })
}

/**
 * 删除评论
 */
export function deleteComment(id) {
    return request({
        url: `/forum/comments/${id}`,
        method: 'delete'
    })
}

/**
 * 获取帖子评论
 */
export function getPostComments(postId) {
    return request({
        url: `/forum/posts/${postId}/comments`,
        method: 'get'
    })
}

/**
 * 点赞评论
 */
export function likeComment(id) {
    return request({
        url: `/forum/comments/${id}/like`,
        method: 'post'
    })
}

/**
 * 取消点赞评论
 */
export function unlikeComment(id) {
    return request({
        url: `/forum/comments/${id}/like`,
        method: 'delete'
    })
}
