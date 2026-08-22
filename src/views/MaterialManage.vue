<template>
  <div>
    <h2 style="margin-bottom:16px;">物料管理</h2>
    <div class="card-row-2" style="display:flex;gap:20px;margin-bottom:16px;">
      <div class="stat-card" style="padding:20px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);flex:1;">
        <h4 style="margin:0 0 8px 0;color:#666;">物料总种类</h4>
        <div class="num" style="font-size:28px;font-weight:bold;color:#333;">{{materialTotal}}</div>
      </div>
      <div class="stat-card" style="padding:20px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);flex:1;">
        <h4 style="margin:0 0 8px 0;color:#666;">库存预警物料</h4>
        <div class="num" style="font-size:28px;font-weight:bold;color:#f56c6c;">{{warnCount}}</div>
      </div>
    </div>
    <div class="panel" style="background:#fff;padding:16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);margin-bottom:16px;">
      <h3 style="margin:0 0 10px 0;">物料规格数量分布</h3>
      <div id="materialChart" style="width:100%;height:260px;"></div>
    </div>

    <!--高级查询区域：物料编码、物料名称、规格、状态下拉-->
    <div class="toolbar" style="margin-bottom:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:#fff;padding:12px;border-radius:8px;">
      <el-input v-model="searchForm.materialCode" placeholder="物料编码" style="width:180px;"></el-input>
      <el-input v-model="searchForm.materialName" placeholder="物料名称" style="width:180px;"></el-input>
      <el-input v-model="searchForm.spec" placeholder="规格" style="width:180px;"></el-input>
      <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width:140px;">
        <el-option label="启用" :value="1"></el-option>
        <el-option label="禁用" :value="0"></el-option>
      </el-select>
      <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
      <el-button size="small" @click="resetSearch">重置</el-button>
      <el-button type="success" size="small" @click="openDialog()">新增物料</el-button>
    </div>

    <table width="100%" style="border-collapse:collapse;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);background:#fff;">
      <thead>
      <tr style="background:#f7f9f8;">
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">ID</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">物料编码</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">物料名称</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">规格</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">单位</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">库存数量</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">预警数量</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">状态</th>
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid #eee;">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in materialList" :key="item.id">
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{item.id}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{item.materialCode}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{item.materialName}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{item.spec}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{item.unit}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{item.stockNum}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{item.warnNum}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">{{item.status===1?'启用':'禁用'}}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">
          <el-button size="mini" type="primary" @click="openDialog(item)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(item.id)">删除</el-button>
        </td>
      </tr>
      </tbody>
    </table>

    <!--分页组件-->
    <div style="margin-top:12px;text-align:right;background:#fff;padding:10px;border-radius:8px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5,10,20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!--新增编辑弹窗-->
    <el-dialog title="物料表单" :visible.sync="dialogVisible" width="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="物料编码">
          <el-input v-model="form.materialCode"></el-input>
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="form.materialName"></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec"></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit"></el-input>
        </el-form-item>
        <el-form-item label="预警数量">
          <el-input-number v-model="form.warnNum" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getMaterialPage,addMaterial,updateMaterial,deleteMaterial,getMaterialStatistics,getMaterialChart,getMaterialInfo} from '@/api/material'
export default {
  name:"MaterialManage",
  data(){
    return {
      searchForm:{
        materialCode:"",
        materialName:"",
        spec:"",
        status:null
      },
      //分页参数
      pageNum:1,
      pageSize:10,
      total:0,

      materialTotal:0,
      warnCount:0,
      materialList:[],
      dialogVisible:false,
      form:{
        id:null,
        materialCode:"",
        materialName:"",
        spec:"",
        unit:"",
        stockNum:0,
        warnNum:0,
        status:1
      },
      chart:null
    }
  },
  mounted(){
    this.loadAllData()
  },
  methods:{
    async loadAllData(){
      await this.loadList()
      await this.loadStatistics()
      await this.loadChart()
    },
    //加载分页列表
    async loadList(){
      const params = {
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        ...this.searchForm
      }
      const res = await getMaterialPage(params)
      if(res.code===200){
        this.materialList = res.data.records
        this.total = res.data.total
      }
    },
    //查询按钮：重置页码到第一页
    handleQuery(){
      this.pageNum = 1
      this.loadList()
    },
    //重置查询条件
    resetSearch(){
      this.searchForm = {materialCode:"",materialName:"",spec:"",status:null}
      this.pageNum = 1
      this.loadList()
    },
    //每页条数改变
    handleSizeChange(val){
      this.pageSize = val
      this.loadList()
    },
    //页码改变
    handleCurrentChange(val){
      this.pageNum = val
      this.loadList()
    },
    async loadStatistics(){
      const res = await getMaterialStatistics()
      if(res.code===200){
        this.materialTotal = res.data.materialTotal
        this.warnCount = res.data.warnCount
      }
    },
    async loadChart(){
      const res = await getMaterialChart()
      if(res.code===200){
        const list = res.data
        const xData = list.map(item=>item.materialName)
        const yData = list.map(item=>item.stockNum)
        if(!this.chart){
          this.chart = this.$echarts.init(document.getElementById('materialChart'))
        }
        this.chart.setOption({
          tooltip:{},
          xAxis:{
            type:'category',
            data:xData
          },
          yAxis:{
            type:'value'
          },
          series:[
            {
              name:'库存数量',
              type:'bar',
              data:yData
            }
          ]
        })
      }
    },
    async openDialog(row){
      this.form = {id:null,materialCode:"",materialName:"",spec:"",unit:"",stockNum:0,warnNum:0,status:1}
      if(row&&row.id){
        const res = await getMaterialInfo(row.id)
        if(res.code===200){
          this.form = res.data
        }
      }
      this.dialogVisible = true
    },
    async submitForm(){
      let res
      if(this.form.id){
        res = await updateMaterial(this.form)
      }else{
        res = await addMaterial(this.form)
      }
      if(res.code===200){
        this.$message.success(res.data||"操作成功")
        this.dialogVisible = false
        this.pageNum = 1
        this.loadAllData()
      }else{
        this.$message.error(res.msg)
      }
    },
    async handleDelete(id){
      this.$confirm('确认删除该物料?','提示',{type:'warning'}).then(async()=>{
        const res = await deleteMaterial(id)
        if(res.code===200){
          this.$message.success("删除成功")
          this.pageNum = 1
          this.loadAllData()
        }else{
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>