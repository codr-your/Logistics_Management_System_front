//前端接口
import request from '@/utils/request'

/**
 * 获取库存流水统计卡片数据
 */
export function getStockRecordStat() {
    return request({
        url: '/stockRecord/stat',
        method: 'get'
    })
}

/**
 * 库存流水列表（带物料名称、编码，模糊查询）
 * @param {String} materialName 物料名称（可选）
 */
export function getStockRecordListWithMaterial(materialName) {
    return request({
        url: '/stockRecord/listWithMaterial',
        method: 'get',
        params: {
            materialName
        }
    })
}

/**
 * 获取近7天出入库图表数据
 */
export function getSevenDayStockChart() {
    return request({
        url: '/stockRecord/sevenDayChart',
        method: 'get'
    })
}











