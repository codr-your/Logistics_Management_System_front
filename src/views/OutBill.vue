<template>
  <div>
    <h2 style="margin-bottom:16px;">出库单据</h2>
    <div class="card-row-2">
      <div class="stat-card">
        <h4>本月出库单数</h4>
        <div class="num">{{monthOutCount}}</div>
      </div>
      <div class="stat-card">
        <h4>本月出库总数量</h4>
        <div class="num">{{monthOutTotal}}</div>
      </div>
    </div>

    <div class="grid-two">
      <div>
        <div class="toolbar">
          <el-input v-model="searchBillNo" placeholder="单据编号" style="width:220px;"></el-input>
          <el-button type="primary" size="small" @click="queryBill">查询</el-button>
          <el-button type="success" size="small">新建出库单</el-button>
        </div>
        <table width="100%" style="border-collapse:collapse;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          <thead>
          <tr style="background:#f7f9f8;">
            <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">单据ID</th>
            <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">单据编号</th>
            <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">出库日期</th>
            <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">操作员</th>
            <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">单据状态</th>
            <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="bill in outBillList" :key="bill.id">
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{bill.id}}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{bill.billNo}}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{bill.billTime}}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{bill.operatorName}}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{bill.status===0?'草稿':'已提交'}}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">
              <el-button size="mini" type="text">查看明细</el-button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <h3>出库物料种类占比</h3>
        <div id="outPieChart" style="width:100%;height:280px;"></div>
        <div style="margin-top:16px;padding:12px;background:#fff3cd;border-radius:8px;">
          <b>待处理提醒</b>
          <p style="margin-top:8px;color:#856404;" v-if="pendingCount>0">存在{{pendingCount}}条待确认出库单据，请及时处理</p>
          <p style="margin-top:8px;color:#856404;" v-else>暂无待确认出库单据</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
// 导入出库api
import { getOutBillList, getOutMonthStat, getOutPieData, getPendingOutCount } from '@/api/outBill'

export default {
  name:"OutBill",
  data(){
    return {
      searchBillNo:"",
      monthOutCount:0,
      monthOutTotal:0,
      outBillList:[],
      pieChart:null,
      pendingCount:0
    }
  },
  mounted() {
    this.queryBill()
    this.loadMonthStat()
    this.loadPendingCount()
    this.initPieChart()
  },
  beforeDestroy(){
    if(this.pieChart){
      this.pieChart.dispose()
    }
  },
  methods:{
    // 查询出库单据列表 billType=2出库
    async queryBill(){
      const res = await getOutBillList({
        billNo:this.searchBillNo,
        billType:2
      })
      if(res.code === 200){
        this.outBillList = res.data
      }
    },
    // 加载本月统计数字
    async loadMonthStat(){
      const res = await getOutMonthStat()
      if(res.code===200 && res.data){
        this.monthOutCount = res.data.monthOutCount
        this.monthOutTotal = res.data.monthOutTotal
      }
    },
    //加载待确认出库草稿数量
    async loadPendingCount(){
      const res = await getPendingOutCount()
      if(res.code===200){
        this.pendingCount = res.data
      }
    },
    //初始化饼图
    async initPieChart(){
      this.pieChart = echarts.init(document.getElementById('outPieChart'))
      const res = await getOutPieData()
      let option = {
        tooltip:{trigger:'item',formatter:"{b}: {c} ({d}%)"},
        legend:{orient:'vertical',left:'left'},
        series:[
          {
            type:'pie',
            radius:'60%',
            data: res.data || []
          }
        ]
      }
      this.pieChart.setOption(option)
      //窗口大小自适应饼图
      window.addEventListener("resize",()=>{
        this.pieChart.resize()
      })
    }
  }
}
</script>