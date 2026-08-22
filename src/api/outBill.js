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