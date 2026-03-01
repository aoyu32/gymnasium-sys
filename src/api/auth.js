import request from '@/utils/request'

/**
 * 用户登录
 */
export function login(data) {
    return request({
        url: '/auth/login',
        method: 'post',
        data
    })
}

/**
 * 学生注册
 */
export function register(data) {
    return request({
        url: '/auth/register',
        method: 'post',
        data
    })
}

/**
 * 重置密码
 */
export function resetPassword(data) {
    return request({
        url: '/auth/reset-password',
        method: 'post',
        data
    })
}

/**
 * 发送验证码
 */
export function sendVerificationCode(email) {
    return request({
        url: '/auth/send-code',
        method: 'post',
        params: { email }
    })
}
