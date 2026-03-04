import request from '@/utils/request'

/**
 * 上传图片
 */
export function uploadImage(file, folder = 'images') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    return request({
        url: '/files/upload/image',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 上传文件
 */
export function uploadFile(file, folder = 'files') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    return request({
        url: '/files/upload/file',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 删除文件
 */
export function deleteFile(url) {
    return request({
        url: '/files/delete',
        method: 'delete',
        params: { url }
    })
}
