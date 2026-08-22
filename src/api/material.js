import request from '@/utils/request'

//获取物料列表（条件查询）
export function getMaterialList(params) {
    return request({
        url: '/material/list',
        method: 'get',
        params
    })
}

//新增物料
export function addMaterial(data) {
    return request({
        url: '/material/add',
        method: 'post',
        data
    })
}

//修改物料
export function updateMaterial(data) {
    return request({
        url: '/material/update',
        method: 'put',
        data
    })
}

//删除物料
export function deleteMaterial(id) {
    return request({
        url: `/material/delete/${id}`,
        method: 'delete'
    })
}

//获取统计数据
export function getMaterialStatistics() {
    return request({
        url: '/material/statistics',
        method: 'get'
    })
}

//图表数据
export function getMaterialChart() {
    return request({
        url: '/material/chartData',
        method: 'get'
    })
}

//根据id查询单个物料
export function getMaterialInfo(id) {
    return request({
        url: `/material/info/${id}`,
        method: 'get'
    })
}


//分页查询物料
export function getMaterialPage(params) {
    return request({
        url: '/material/page',
        method: 'get',
        params
    })
}

