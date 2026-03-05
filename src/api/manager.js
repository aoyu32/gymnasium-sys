import request from '@/utils/request'

/**
 * 获取当前场地负责人信息
 */
export function getCurrentManager() {
    return request({
        url: '/managers/current',
        method: 'get'
    })
}

/**
 * 更新场地负责人信息
 */
export function updateManager(data) {
    return request({
        url: '/managers/current',
        method: 'put',
        data
    })
}

/**
 * 修改密码
 */
export function changePassword(data) {
    return request({
        url: '/managers/password',
        method: 'put',
        data
    })
}

/**
 * 更新头像
 */
export function updateAvatar(avatarUrl) {
    return request({
        url: '/managers/avatar',
        method: 'post',
        params: { avatarUrl }
    })
}
