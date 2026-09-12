<template>
  <div class="stock-record-page">
    <h2 style="margin-bottom:16px;">库存变动流水</h2>
    <!-- 顶部统计卡片 -->
    <div class="card-row-2">
      <div class="stat-card">
        <h4>总变动记录数</h4>
        <div class="num">{{statData.totalRecord}}</div>
      </div>
      <div class="stat-card">
        <h4>累计入库数量</h4>
        <div class="num">{{statData.totalIn}}</div>
      </div>
      <div class="stat-card">
        <h4>累计出库数量</h4>
        <div class="num">{{statData.totalOut}}</div>
      </div>
      <div class="stat-card">
        <h4>物料种类总数</h4>
        <div class="num">{{statData.materialTypeCnt}}</div>
      </div>
    </div>

    <!-- 折线图区域 -->
    <div class="chart-card" style="padding:16px;margin-bottom:16px;background:#fff;">
      <h4>近7天出入库趋势</h4>
      <div id="sevenChart" style="width:100%;height:320px;"></div>
    </div>

    <!-- 搜索栏 -->
    <div class="toolbar" style="margin-bottom:12px;">
      <el-input v-model="searchName" placeholder="输入物料名称搜索" style="width:260px;"></el-input>
      <el-button type="primary" @click="queryTable">查询</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <!-- 流水表格 -->
    <el-table :data="tableData" border stripe>
      <el-table-column label="流水ID" prop="id" width="80"></el-table-column>
      <el-table-column label="物料编码" prop="materialCode"></el-table-column>
      <el-table-column label="物料名称" prop="materialName"></el-table-column>
      <el-table-column label="操作类型" prop="operateType"></el-table-column>
      <el-table-column label="变动数量" prop="changeNum"></el-table-column>
      <el-table-column label="变动后库存" prop="afterStock"></el-table-column>
      <el-table-column label="变动时间" prop="createTime"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStockRecordStat, getStockRecordListWithMaterial, getSevenDayStockChart } from '@/api/stockRecord'
import * as echarts from 'echarts'
export default {
  name: 'StockLog', // 已修改组件名
  data() {
    return {
      statData: {
        totalRecord: 0,
        totalIn: 0,
        totalOut: 0,
        materialTypeCnt: 0
      },
      searchName: '',
      tableData: [],
      chartData: []
    }
  },
  mounted() {
    this.loadAllData()
  },
  methods: {
    //一次性加载所有数据
    async loadAllData() {
      await this.getStatData()
      await this.queryTable()
      await this.getChartData()
    },
    // 获取顶部统计卡片
    async getStatData() {
      const res = await getStockRecordStat()
      if(res.code === 200){
        this.statData = res.data
      }
    },
    // 查询表格
    async queryTable() {
      const res = await getStockRecordListWithMaterial(this.searchName)
      if(res.code === 200){
        this.tableData = res.data
      }
    },
    //重置搜索
    resetSearch() {
      this.searchName = ''
      this.queryTable()
    },
    // 获取图表并渲染
    async getChartData() {
      const res = await getSevenDayStockChart()
      if(res.code === 200){
        this.chartData = res.data
        this.renderChart()
      }
    },
    renderChart() {
      const chartDom = document.getElementById('sevenChart')
      const myChart = echarts.init(chartDom)
      // 整理x轴、入库、出库数组
      const xAxisData = this.chartData.map(item => item.date)
      const inData = this.chartData.map(item => item.inCount)
      const outData = this.chartData.map(item => item.outCount)
      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['入库','出库'] },
        xAxis: { type: 'category', data: xAxisData },
        yAxis: { type: 'value' },
        series: [
          { name:'入库', type:'line', data:inData },
          { name:'出库', type:'line', data:outData }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.card-row-2{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap:12px;
  margin-bottom:16px;
}
.stat-card{
  background:#fff;
  padding:16px;
  border-radius:4px;
}
.stat-card h4{
  margin:0 0 8px 0;
  color:#666;
  font-weight:normal;
}
.num{
  font-size:28px;
  font-weight:bold;
  color:#409EFF;
}
</style>