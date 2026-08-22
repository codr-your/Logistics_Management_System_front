<template>
  <div>
    <div class="card-row" style="display:flex;gap:16px;margin-bottom:16px;flex-wrap:wrap;">
      <div class="stat-card" style="flex:1;min-width:200px;padding:20px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <h4 style="margin:0 0 8px 0;color:#666;font-size:14px;">系统用户总数</h4>
        <div class="num" style="font-size:28px;font-weight:bold;">{{ stat.userTotal }}</div>
      </div>
      <div class="stat-card" style="flex:1;min-width:200px;padding:20px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <h4 style="margin:0 0 8px 0;color:#666;font-size:14px;">物料总种类</h4>
        <div class="num" style="font-size:28px;font-weight:bold;">{{ stat.materialTotal }}</div>
      </div>
           <div class="stat-card" style="flex:1;min-width:200px;padding:20px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <h4 style="margin:0 0 8px 0;color:#666;font-size:14px;">今日入库单</h4>
        <div class="num" style="font-size:28px;font-weight:bold;color:#67c23a;">{{ stat.todayIn }}</div>
      </div>
      <div class="stat-card" style="flex:1;min-width:200px;padding:20px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <h4 style="margin:0 0 8px 0;color:#666;font-size:14px;">今日出库单</h4>
        <div class="num" style="font-size:28px;font-weight:bold;color:#f56c6c;">{{ stat.todayOut }}</div>
      </div>
    </div>

    <div class="bottom-row" style="display:flex;gap:16px;margin-bottom:16px;flex-wrap:wrap;">
      <div class="panel" style="flex:2;min-width:450px;background:#fff;padding:16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <h3 style="margin:0 0 10px 0;">近7天出入库趋势</h3>
        <div id="sevenDayChart" style="width:100%;height:260px;"></div>
      </div>
      <div class="panel" style="flex:1;min-width:300px;background:#fff;padding:16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <h3 style="margin:0 0 10px 0;">简易库存预警列表</h3>
        <div class="list-item" v-for="item in warnList" :key="item.id" style="padding:4px 0;">
          {{item.materialName}}｜库存:{{item.stockNum}}，阈值:{{item.warnNum}}
        </div>
      </div>
    </div>

    <div class="panel" style="background:#fff;padding:16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:16px;">
      <h3 style="margin:0 0 10px 0;">库存预警详情表</h3>
      <table width="100%" style="border-collapse:collapse;border-radius:14px;overflow:hidden;">
        <thead>
        <tr style="background:#f7f9f8;">
          <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">物料编码</th>
          <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">物料名称</th>
          <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">当前库存</th>
          <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">预警阈值</th>
          <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">状态</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in warnTable" :key="row.id">
          <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{row.materialCode}}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{row.materialName}}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{row.stockNum}}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{row.warnNum}}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;color:#f56c6c;">库存不足</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="panel" style="background:#fff;padding:16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
      <h3 style="margin:0 0 10px 0;">最近出入库单据</h3>
      <table width="100%" style="border-collapse:collapse;border-radius:14px;overflow:hidden;">
        <thead>
        <tr style="background:#f7f9f8;">
          <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">单据编号</th>
          <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">单据类型</th>
          <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">操作时间</th>
          <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">操作员ID</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="bill in recentBillList" :key="bill.id">
          <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{bill.billNo}}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{ bill.billType ===1 ? '入库':'出库' }}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{ formatTime(bill.billTime) }}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{bill.operatorId}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {getDashboardStat,getDashboardChart,getWarnMaterial,getLatestBill} from '@/api/dashboard'
export default {
  name:"Dashboard",
  data(){
    return {
      stat:{
        userTotal:0,
        materialTotal:0,
        todayIn:0,
        todayOut:0
      },
      warnList:[],
      warnTable:[],
      recentBillList:[],
      chart:null
    }
  },
  mounted(){
    this.loadDashboardData()
  },
  beforeDestroy(){
    //页面销毁释放echarts实例，防止内存泄漏
    if(this.chart){
      this.chart.dispose()
      this.chart = null
    }
  },
  methods:{
    formatTime(str){
      if(!str) return ''
      return str.substring(0,19)
    },
    async loadDashboardData(){
      try{
        //1.统计卡片
        const resStat = await getDashboardStat()
        if(resStat.code === 200){
          this.stat = resStat.data
        }
        //2.预警物料
        const resWarn = await getWarnMaterial()
        if(resWarn.code===200){
          this.warnList = resWarn.data
          this.warnTable = resWarn.data
        }
        //3.最近单据
        const resBill = await getLatestBill()
        if(resBill.code===200){
          this.recentBillList = resBill.data
        }

        // 4.加载图表数据
        const resChart = await getDashboardChart()
        if(resChart.code===200){
          const chartData = resChart.data
          const xData = chartData.map(i=>i.date)
          const inArr = chartData.map(i=>i.inCount)
          const outArr = chartData.map(i=>i.outCount)

          console.log("xData",xData)
          console.log("入库",inArr)
          console.log("出库",outArr)

          // $nextTick：等待DOM渲染完毕，再初始化echarts
          this.$nextTick(()=>{
            const dom = document.getElementById('sevenDayChart')
            if(!dom){
              console.error("找不到sevenDayChart DOM节点")
              return
            }
            if(this.chart){
              this.chart.dispose()
            }
            this.chart = this.$echarts.init(dom)
            this.chart.setOption({
              tooltip:{trigger:"axis"},
              legend:{data:['入库','出库']},
              xAxis:{type:'category',data:xData},
              yAxis:{type:'value'},
              series:[
                {name:'入库',type:'line',data:inArr},
                {name:'出库',type:'line',data:outArr}
              ]
            })
          })
        }
      }catch(e){
        console.error("页面数据加载异常",e)
      }
    }
  }
}
</script>