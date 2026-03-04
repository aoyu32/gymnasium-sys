import request from '@/utils/request'

// 分页查询器材列表
export function getEquipmentPage(params) {
    return request({
        url: '/equipment/page',
        method: 'get',
        params
    })
}

// 获取器材详情
export function getEquipmentById(id) {
    return request({
        url: `/equipment/${id}`,
        method: 'get'
    })
}

// 创建器材
export function createEquipment(data) {
    return request({
        url: '/equipment',
        method: 'post',
        data
    })
}

// 更新器材
export function updateEquipment(id, data) {
    return request({
        url: `/equipment/${id}`,
        method: 'put',
        data
    })
}

// 删除器材
export function deleteEquipment(id) {
    return request({
        url: `/equipment/${id}`,
        method: 'delete'
    })
}

// 获取器材的品牌规格列表
export function getBrandsByEquipmentId(equipmentId) {
    return request({
        url: `/equipment/${equipmentId}/brands`,
        method: 'get'
    })
}

// 添加品牌规格
export function addBrand(equipmentId, data) {
    return request({
        url: `/equipment/${equipmentId}/brands`,
        method: 'post',
        data
    })
}

// 更新品牌规格
export function updateBrand(equipmentId, brandId, data) {
    return request({
        url: `/equipment/${equipmentId}/brands/${brandId}`,
        method: 'put',
        data
    })
}

// 删除品牌规格
export function deleteBrand(equipmentId, brandId) {
    return request({
        url: `/equipment/${equipmentId}/brands/${brandId}`,
        method: 'delete'
    })
}

// 报废品牌规格
export function scrapBrand(equipmentId, brandId, data) {
    return request({
        url: `/equipment/${equipmentId}/brands/${brandId}/scrap`,
        method: 'post',
        data
    })
}

// 提交借用申请
export function createBorrowApplication(data) {
    return request({
        url: '/equipment/borrow',
        method: 'post',
        data
    })
}

// 获取我的借用记录
export function getMyBorrowRecords() {
    return request({
        url: '/equipment/borrow/my',
        method: 'get'
    })
}

// 分页查询借用申请（场地负责人）
export function getBorrowApplicationPage(params) {
    return request({
        url: '/equipment/borrow/page',
        method: 'get',
        params
    })
}

// 获取借用申请详情
export function getBorrowApplicationById(id) {
    return request({
        url: `/equipment/borrow/${id}`,
        method: 'get'
    })
}

// 通过借用申请
export function approveBorrowApplication(id) {
    return request({
        url: `/equipment/borrow/${id}/approve`,
        method: 'post'
    })
}

// 拒绝借用申请
export function rejectBorrowApplication(id, data) {
    return request({
        url: `/equipment/borrow/${id}/reject`,
        method: 'post',
        data
    })
}

// 删除借用申请记录
export function deleteBorrowApplication(id) {
    return request({
        url: `/equipment/borrow/${id}`,
        method: 'delete'
    })
}

// 取消通过借用申请
export function cancelBorrowApplication(id) {
    return request({
        url: `/equipment/borrow/${id}/cancel`,
        method: 'post'
    })
}

// ==================== 器材归还相关接口 ====================

// 提交归还申请
export function createReturnApplication(data) {
    return request({
        url: '/equipment/return',
        method: 'post',
        data
    })
}

// 获取我的归还记录
export function getMyReturnRecords() {
    return request({
        url: '/equipment/return/my',
        method: 'get'
    })
}

// 分页查询归还申请（场地负责人）
export function getReturnApplicationPage(params) {
    return request({
        url: '/equipment/return/page',
        method: 'get',
        params
    })
}

// 获取归还申请详情
export function getReturnApplicationById(id) {
    return request({
        url: `/equipment/return/${id}`,
        method: 'get'
    })
}

// 通过归还申请
export function approveReturnApplication(id) {
    return request({
        url: `/equipment/return/${id}/approve`,
        method: 'post'
    })
}

// 拒绝归还申请
export function rejectReturnApplication(id, data) {
    return request({
        url: `/equipment/return/${id}/reject`,
        method: 'post',
        data
    })
}

// 删除归还申请记录
export function deleteReturnApplication(id) {
    return request({
        url: `/equipment/return/${id}`,
        method: 'delete'
    })
}
