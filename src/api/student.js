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
