<template>
  <div class="out-bill-page">
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
          <el-button type="success" size="small" @click="openAddDialog">新建出库单</el-button>
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
              <el-button size="mini" type="text" @click="openDetail(bill.id)">查看明细</el-button>
  <!-- 只有草稿status=0才显示提交按钮 -->
              <el-button v-if="bill.status === 0" size="mini" type="success" @click="handleSubmitDraft(bill)">提交单据</el-button>
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

    <!-- 新建出库单弹窗 -->
    <el-dialog title="新建出库单" :visible.sync="addOutBillVisible" width="70%">
      <el-form :model="outBillForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据编号">
              <el-input v-model="outBillForm.billNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="outBillForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="物料明细">
          <el-table :data="outBillForm.itemList" border style="width:100%">
            <el-table-column label="物料选择">
              <template slot-scope="scope">
                <el-select v-model="scope.row.materialId" placeholder="请选择物料" @change="handleMaterialChange(scope.row)">
                  <el-option v-for="mat in materialList" :key="mat.id" :label="mat.materialName" :value="mat.id" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="物料名称" prop="materialName"></el-table-column>
            <el-table-column label="单位" prop="unit"></el-table-column>
            <el-table-column label="出库数量">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.operateNum" :min="1"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" danger @click="removeItem(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="small" style="margin-top:10px" @click="addItem">新增一行</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOutBillVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="success" @click="handleSubmitBill">提交单据</el-button>
      </div>
    </el-dialog>

    <!-- 查看明细弹窗【只读】 -->
    <el-dialog title="单据详情" :visible.sync="detailDialogVisible" width="70%">
      <el-form :model="detailForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据编号">
              <el-input v-model="detailForm.billNo" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-input :value="detailForm.status===0?'草稿':'已提交'" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出库时间">
              <el-input v-model="detailForm.billTime" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="detailForm.remark" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="明细列表">
          <el-table :data="detailForm.itemList" border style="width:100%">
            <el-table-column label="物料ID" prop="materialId"></el-table-column>
            <el-table-column label="出库数量" prop="operateNum"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as echarts from 'echarts'
// 导入出库api
import { getOutBillList, getOutMonthStat, getOutPieData, getPendingOutCount, submitDraftBill } from '@/api/outBill'
import * as outBillApi from '@/api/outBill'
import { getMaterialList } from '@/api/material'

export default {
  name:"OutBill",
  data(){
    return {
      searchBillNo:"",
      monthOutCount:0,
      monthOutTotal:0,
      outBillList:[],
      pieChart:null,
      pendingCount:0,
      // =========修复：补充弹窗显示变量=========
      addOutBillVisible:false,
      detailDialogVisible:false,

      materialList:[],
      outBillForm:{
        billNo:"",
        billType:"2",
        operatorId: null,
        remark:"",
        itemList:[]
      },
      detailForm:{
        billNo:"",
        billTime:"",
        status:null,
        remark:"",
        itemList:[]
      }
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
    },


    //打开新建弹窗
    async openAddDialog(){
      this.addOutBillVisible = true
      //生成出库单号 CK+时间
      const d = new Date()
      const y = d.getFullYear()
      const m = String(d.getMonth()+1).padStart(2,'0')
      const day = String(d.getDate()).padStart(2,'0')
      const h = String(d.getHours()).padStart(2,'0')
      const mi = String(d.getMinutes()).padStart(2,'0')
      this.outBillForm.billNo = `CK${y}${m}${day}${h}${mi}`
      this.outBillForm.remark = ""
      this.outBillForm.itemList = []

      //获取登录用户id，项目没有vuex用户，从localStorage读取，兜底写死1调试
      let loginUserId = null
      let userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          loginUserId = userObj.id
          console.log("✅localStorage获取登录用户id = ", loginUserId)
        } catch (err) {
          console.error("解析本地用户对象异常", err)
        }
      }
      if (!loginUserId) {
        loginUserId = 1
        console.warn("⚠未读取到登录用户，临时使用 operatorId=1")
      }
      this.outBillForm.operatorId = loginUserId

      //加载物料下拉
      const matRes = await getMaterialList({})
      if(matRes.code ===200){
        this.materialList = matRes.data
      }
    },

    addItem(){
      this.outBillForm.itemList.push({
        materialId:null,
        materialName:"",
        unit:"",
        operateNum:1
      })
    },

    removeItem(index){
      this.outBillForm.itemList.splice(index,1)
    },

    handleMaterialChange(row){
      const mat = this.materialList.find(x=>x.id === row.materialId)
      if(mat){
        row.materialName = mat.materialName
        row.unit = mat.unit
      }
    },

    //保存草稿
    async handleSaveDraft(){
      if(this.outBillForm.itemList.length === 0){
        this.$message.warning("请添加至少一条物料明细")
        return
      }
      const res = await outBillApi.saveOutBillDraft(this.outBillForm)
      if(res.code === 200){
        this.$message.success("草稿保存成功")
        this.addOutBillVisible = false
        this.queryBill()
      }
    },

    //提交正式出库单据
    async handleSubmitBill(){
      if(this.outBillForm.itemList.length === 0){
        this.$message.warning("请添加至少一条物料明细")
        return
      }
      const res = await outBillApi.submitOutBill(this.outBillForm)
      if(res.code === 200){
        this.$message.success("单据提交成功")
        this.addOutBillVisible = false
        this.queryBill()
      }
    },

    //打开查看明细弹窗
    async openDetail(billId){
      const res = await outBillApi.getBillDetail(billId)
      if(res.code === 200){
        const vo = res.data
        this.detailForm.billNo = vo.billNo
        this.detailForm.billTime = vo.billTime
        this.detailForm.status = vo.status
        this.detailForm.remark = vo.remark
        this.detailForm.itemList = vo.itemList || []
        this.detailDialogVisible = true
      }
    },

    //草稿单据提交转正
    //草稿单据提交转正
async handleSubmitDraft(bill){
  this.$confirm('确认提交该出库草稿？提交后扣减库存，操作不可撤销','提示',{
    confirmButtonText:'确认提交',
    cancelButtonText:'取消',
    type:'warning'
  }).then(async ()=>{
    try{
      const res = await submitDraftBill(bill.id)
      if(res.code === 200){
        this.$message.success("单据提交成功")
        this.queryBill()       //刷新单据列表
        this.loadPendingCount()//刷新待提交草稿数量（仪表盘）
      }
    }catch(err){
      // 兼容两种返回格式
      let errMsg = "接口异常"
      if(err && err.msg) errMsg = err.msg
      else if(err && err.response && err.response.data && err.response.data.msg) errMsg = err.response.data.msg
      this.$message.error("提交失败："+errMsg)
    }
  }).catch(()=>{
    this.$message.info("已取消提交")
  })
}
  }
}
</script>