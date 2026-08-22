import request from '@/utils/request'

//获取仪表盘顶部统计
export function getDashboardStat() {
    return request({
        url: '/dashboard/getStat',
        method: 'get'
    })
}

//获取7天出入库图表
export function getDashboardChart() {
    return request({
        url: '/dashboard/getStatChart',
        method: 'get'
    })
}

//预警物料列表
export function getWarnMaterial() {
    return request({
        url: '/dashboard/warnMaterial',
        method: 'get'
    })
}

//最近单据
export function getLatestBill() {
    return request({
        url: '/dashboard/latestBill',
        method: 'get'
    })
}