import request from '@/utils/request'

//单据列表查询
export function getBillList(params) {
    return request({
        url: '/materialBill/billlist',
        method: 'get',
        params
    })
}

//提交单据
export function submitBill(data) {
    return request({
        url: '/materialBill/submit',
        method: 'post',
        data
    })
}

//获取单据详情（携带明细）
export function getBillDetail(id) {
    return request({
        url: `/materialBill/detail/${id}`,
        method: 'get'
    })
}

//获取全部物料（新建单据下拉选择）
export function getMaterialAll() {
    return request({
        url: '/material/listAll',
        method: 'get'
    })
}