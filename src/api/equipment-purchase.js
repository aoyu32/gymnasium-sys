import request from '@/utils/request'

/**
 * 提交进货申请
 */
export function submitPurchase(data) {
    return request({
        url: '/equipment-purchases',
        method: 'post',
        data
    })
}
