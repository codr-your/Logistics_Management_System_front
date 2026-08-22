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
          <el-button type="primary" size="small">查询</el-button>
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
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{bill.status}}</td>
            <td style="padding:12px 16px;border-bottom:1px solid #eee;">
              <el-button size="mini" type="text">查看明细</el-button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="panel">
        <h3>出库物料种类占比</h3>
        <div class="fake-chart">饼图占位：出库物料占比</div>
        <div style="margin-top:16px;padding:12px;background:#fff3cd;border-radius:8px;">
          <b>待处理提醒</b>
          <p style="margin-top:8px;color:#856404;">存在1条待确认出库单据，请及时处理</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"OutBill",
  data(){
    return {
      searchBillNo:"",
      monthOutCount:0,
      monthOutTotal:0,
      outBillList:[]
    }
  }
}
</script>