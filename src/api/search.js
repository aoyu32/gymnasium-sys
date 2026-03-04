import request from '@/utils/request'

// 全局搜索
export function search(params) {
    return request({
        url: '/search',
        method: 'get',
        params
    })
}
