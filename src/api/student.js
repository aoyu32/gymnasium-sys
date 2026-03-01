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
