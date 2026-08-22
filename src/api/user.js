import request from '@/utils/request'

// 用户分页查询 GET /user/list
export function getUserPage(params) {
    return request({
        url: '/user/list',
        method: 'get',
        params
    })
}

//新增用户 POST /user/add
export function addUser(data) {
    return request({
        url: '/user/add',
        method: 'post',
        data
    })
}

//修改用户 PUT /user/update
export function updateUser(data) {
    return request({
        url: '/user/update',
        method: 'put',
        data
    })
}

//删除用户 DELETE /user/delete/{id}
export function deleteUser(id) {
    return request({
        url: `/user/delete/${id}`,
        method: 'delete'
    })
}