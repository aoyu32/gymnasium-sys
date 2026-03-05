import request from '@/utils/request'

/**
 * 分页查询学生列表
 */
export function getStudentList(params) {
    return request({
        url: '/admin/students',
        method: 'get',
        params
    })
}

/**
 * 获取学生详情
 */
export function getStudentDetail(id) {
    return request({
        url: `/admin/students/${id}`,
        method: 'get'
    })
}

/**
 * 添加学生
 */
export function addStudent(data) {
    return request({
        url: '/admin/students',
        method: 'post',
        data
    })
}

/**
 * 更新学生信息
 */
export function updateStudent(id, data) {
    return request({
        url: `/admin/students/${id}`,
        method: 'put',
        data
    })
}

/**
 * 删除学生
 */
export function deleteStudent(id) {
    return request({
        url: `/admin/students/${id}`,
        method: 'delete'
    })
}

/**
 * 切换学生状态
 */
export function toggleStudentStatus(id) {
    return request({
        url: `/admin/students/${id}/toggle-status`,
        method: 'put'
    })
}
