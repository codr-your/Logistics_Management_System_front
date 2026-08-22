<template>
  <div>
    <h2 style="margin-bottom:16px;">库存变动记录</h2>
    <div class="card-row">
      <div class="stat-card">
        <h4>总变动记录</h4>
        <div class="num">{{totalLog}}</div>
      </div>
      <div class="stat-card">
        <h4>累计入库</h4>
        <div class="num">{{totalInNum}}</div>
      </div>
      <div class="stat-card">
        <h4>累计出库</h4>
        <div class="num">{{totalOutNum}}</div>
      </div>
      <div class="stat-card">
        <h4>当前物料种类</h4>
        <div class="num">{{materialCount}}</div>
      </div>
    </div>

    <div class="panel">
      <h3>每日库存变动统计</h3>
      <div class="fake-chart">柱状图占位：每日入库出库数量对比</div>
    </div>

    <div class="toolbar">
      <el-input v-model="searchMaterialName" placeholder="物料名称" style="width:220px;"></el-input>
      <el-button type="primary" size="small">查询</el-button>
    </div>

    <table width="100%" style="border-collapse:collapse;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
      <thead>
      <tr style="background:#f7f9f8;">
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">ID</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">物料编码</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">物料名称</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">变动类型</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">变动数量</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">变动后库存</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">操作时间</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="log in stockLogList" :key="log.id">
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{log.id}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{log.materialCode}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{log.materialName}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{log.changeType}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{log.changeNum}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{log.stockAfter}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{log.operateTime}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name:"StockLog",
  data(){
    return {
      searchMaterialName:"",
      totalLog:0,
      totalInNum:0,
      totalOutNum:0,
      materialCount:0,
      stockLogList:[]
    }
  }
}
</script>