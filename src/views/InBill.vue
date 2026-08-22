<template>
  <div>
    <h2 style="margin-bottom:16px;">入库单据</h2>
    <div class="panel" style="background:#fff;padding:16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:16px;">
      <div class="toolbar" style="margin-bottom:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <el-input v-model="searchBillNo" placeholder="单据编号" style="width:220px;"></el-input>
        <el-button type="primary" size="small" @click="loadBillList">查询</el-button>
        <el-button type="success" size="small" @click="openNewBillDialog">新建入库单</el-button>
      </div>

      <el-table :data="inBillList" border style="width:100%">
        <el-table-column label="单据ID" prop="id"></el-table-column>
        <el-table-column label="单据编号" prop="billNo"></el-table-column>
        <el-table-column label="入库日期" prop="billTime"></el-table-column>
        <el-table-column label="操作员ID" prop="operatorId"></el-table-column>
        <el-table-column label="单据类型">
          <template slot-scope="scope">
            {{scope.row.billType===1?'入库':'出库'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="viewDetail(scope.row.id)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--单据明细弹窗 -->
    <el-dialog title="单据明细" :visible.sync="detailDialogVisible" width="700px">
      <el-table :data="billDetailList" border style="width:100%">
        <el-table-column label="物料ID" prop="materialId"></el-table-column>
        <el-table-column label="入库数量" prop="operateNum"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="detailDialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <!--新建入库弹窗 -->
    <el-dialog title="新建入库单" :visible.sync="newDialogVisible" width="720px">
      <el-form :model="billForm" label-width="100px">
        <el-form-item label="单据编号">
          <el-input v-model="billForm.billNo"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="billForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin:10px 0;">
        <el-button size="small" type="primary" @click="addLine">+增加物料行</el-button>
      </div>
      <el-table :data="itemTable" border style="width:100%">
        <el-table-column label="选择物料">
          <template slot-scope="scope">
            <el-select v-model="scope.row.materialId" placeholder="请选择物料">
              <el-option v-for="m in materialOptions" :key="m.id" :label="m.materialName" :value="m.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="入库数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.operateNum" :min="1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="removeLine(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="newDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitNewBill">提交入库单据</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'

export default {
  name:"InBill",
  data(){
    return {
      searchBillNo:"",
      inBillList:[],
      billDetailList:[],
      detailDialogVisible:false,
      newDialogVisible:false,
      billForm:{
        billNo:"",
        remark:"",
      },
      itemTable:[],
      materialOptions:[]
    }
  },
  mounted(){
    console.log("====当前真实InBill组件mounted=== _uid=", this._uid)
    this.loadBillList()
    this.loadMaterialOption()
  },
  methods:{
    //加载入库单据列表 billType=1 只查入库
   async loadBillList(){
  const instanceId = Math.random().toFixed(4)
  console.log("【组件实例"+instanceId+"】loadBillList执行 _uid=", this._uid)

  const res = await request({
    url:'/materialBill/billlist',
    method:'get',
    params:{billNo:this.searchBillNo,billType:1}
  })
  console.log("【组件实例"+instanceId+"】接口完整res.data", res.data)
  // res.data直接就是数组，不要取resp.code判断
  const list = res.data
  console.log("【组件实例"+instanceId+"】拿到的list长度：", list.length)

  this.inBillList = [...list]
  console.log("【组件实例"+instanceId+"】赋值后 inBillList=", JSON.parse(JSON.stringify(this.inBillList)))
  console.log("【组件实例"+instanceId+"】赋值后长度 =", this.inBillList.length)
},
    //加载物料下拉选项
  async loadMaterialOption(){
  const res = await request({
    url:'/material/listAll',
    method:'get'
  })
  // res.data直接就是物料数组，不要判断code，不要取resp.data
  this.materialOptions = res.data
  console.log("物料下拉选项：",this.materialOptions)
},
    //查看单据明细
    async viewDetail(id){
      const res = await request({
        url:`/materialBill/detail/${id}`,
        method:'get'
      })
      const resp = res.data
      this.billDetailList = resp.itemList
      this.detailDialogVisible = true
    },
    //打开新建弹窗
    openNewBillDialog(){
      this.billForm = {billNo:"",remark:""}
      this.itemTable = []
      this.addLine()
      this.newDialogVisible = true
    },
    addLine(){
      this.itemTable.push({materialId:null,operateNum:1})
    },
    removeLine(idx){
      this.itemTable.splice(idx,1)
    },
    //提交入库单据
    async submitNewBill(){
      if(!this.billForm.billNo){
        this.$message.warning("请输入单据编号")
        return
      }
      if(this.itemTable.length<=0){
        this.$message.warning("请添加物料明细行")
        return
      }
      for(let row of this.itemTable){
        if(!row.materialId || !row.operateNum){
          this.$message.warning("物料和数量不能为空")
          return
        }
      }
      const submitData = {
        billNo:this.billForm.billNo,
        billType:"1",
        operatorId:1,
        remark:this.billForm.remark,
        itemList:this.itemTable
      }
      try {
        const res = await request({
          url:'/materialBill/submit',
          method:'post',
          data:submitData
        })
        console.log("submit返回结果：", res)
        // 当前拦截器剥掉外层Result，请求不抛异常=业务提交成功
        this.$message.success("单据提交成功")
        this.newDialogVisible = false
        this.loadBillList()
      } catch (err) {
        // 捕获后端抛出的异常（业务失败、校验错误）
        console.error("提交失败",err)
        this.$message.error("提交单据失败")
      }
    }
  }
}
</script>