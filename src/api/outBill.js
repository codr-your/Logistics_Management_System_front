import request from '@/utils/request'

/**
 * 出库单据列表
 * @param {Object} params {billNo,billType}
 */
export function getOutBillList(params) {
    return request({
        url: '/materialBill/billlist',
        method: 'get',
        params
    })
}

/**
 * 获取本月出库统计
 */
export function getOutMonthStat() {
    return request({
        url: '/materialBill/outBill/monthStat',
        method: 'get'
    })
}

/**
 * 获取出库饼图数据
 */
export function getOutPieData() {
    return request({
        url: '/materialBill/outBill/pieData',
        method: 'get'
    })
}

/**
 * 获取待确认出库草稿数量
 */
export function getPendingOutCount() {
    return request({
        url: '/materialBill/outBill/pendingCount',
        method: 'get'
    })

}




/**
 * 保存出库草稿
 */
export function saveOutBillDraft(data) {
    return request({
        url: '/materialBill/saveDraft',
        method: 'post',
        data
    })
}

/**
 * 提交出库正式单据
 */
export function submitOutBill(data) {
    return request({
        url: '/materialBill/submit',
        method: 'post',
        data
    })
}

/**
 * 根据id获取单据详情（用于查看明细）
 */
export function getBillDetail(id) {
    return request({
        url: `/materialBill/detail/${id}`,
        method: 'get'
    })
}


// 根据草稿id，直接提交草稿出库单
export function submitDraftToBill(billId) {
    return request({
        url: `/materialBill/outBill/submitDraft/${billId}`,
        method: 'post'
    })
}

