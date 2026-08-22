<template>
  <div class="page">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="openAddDialog">新增用户</el-button>
    </div>

    <!-- 查询区域 -->
    <el-form :inline="true" :model="queryForm" class="search-form panel">
      <el-form-item label="用户名">
        <el-input v-model="queryForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="queryForm.role" placeholder="全部">
          <el-option label="管理员" :value="1"></el-option>
          <el-option label="普通用户" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadUserList">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户表格 -->
    <div class="table-wrap panel">
      <el-table :data="tableData" border style="width:100%" class="my-table">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="realName" label="真实姓名"></el-table-column>
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <span>{{ scope.row.role ===1 ? "管理员":"普通用户" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status===1?'success':'danger'">
              {{ scope.row.status===1?"正常":"禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" type="text" @click="openEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="text" danger @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageVO.pageNum"
        :page-sizes="[5,10,20]"
        :page-size="pageVO.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageVO.total"
        class="my-pagination">
      </el-pagination>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog title="用户信息" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="isAdd">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role">
            <el-option label="管理员" :value="1"></el-option>
            <el-option label="普通用户" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="正常" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//====================对接后端说明====================
//后端控制器：SysUserController.java  @RequestMapping("/user")
//接口列表：
//GET /user/list        用户分页查询
//POST /user/add        新增用户
//PUT /user/update      修改用户
//DELETE /user/delete/{id} 删除用户
//===================================================
import { getUserPage, addUser, updateUser, deleteUser } from "@/api/user";
export default {
  name:"UserManage",
  data(){
    return{
      queryForm:{
        username:"",
        role:null
      },
      tableData:[],
      pageVO:{
        pageNum:1,
        pageSize:10,
        total:0
      },
      dialogVisible:false,
      isAdd:true,
      form:{
        id:null,
        username:"",
        password:"",
        realName:"",
        role:2,
        status:1
      }
    }
  },
  mounted(){
    this.loadUserList()
  },
  methods:{
    //加载用户列表
    async loadUserList(){
      const params = {
        pageNum:this.pageVO.pageNum,
        pageSize:this.pageVO.pageSize,
        username:this.queryForm.username,
        role:this.queryForm.role
      }
      //调用后端 GET /user/list
      const res = await getUserPage(params)
      if(res.code ===200){
        this.tableData = res.data.records
        this.pageVO.total = res.data.total
      }
    },
    resetQuery(){
      this.queryForm={username:"",role:null}
      this.pageVO.pageNum=1
      this.loadUserList()
    },
    handleSizeChange(val){
      this.pageVO.pageSize = val
      this.loadUserList()
    },
    handleCurrentChange(val){
      this.pageVO.pageNum = val
      this.loadUserList()
    },
    openAddDialog(){
      this.isAdd = true
      this.dialogVisible = true
      this.form = {id:null,username:"",password:"",realName:"",role:2,status:1}
    },
    openEditDialog(row){
      this.isAdd = false
      this.dialogVisible = true
      this.form = {...row}
    },
    async submitForm(){
      if(this.isAdd){
        //后端 POST /user/add
        const res = await addUser(this.form)
        if(res.code===200){
          this.$message.success("新增成功")
          this.dialogVisible=false
          this.loadUserList()
        }
      }else{
        //后端 PUT /user/update
        const res = await updateUser(this.form)
        if(res.code===200){
          this.$message.success("修改成功")
          this.dialogVisible=false
          this.loadUserList()
        }
      }
    },
    async handleDelete(id){
      this.$confirm("确定删除该用户？","提示").then(async ()=>{
        //后端 DELETE /user/delete/{id}
        const res = await deleteUser(id)
        if(res.code===200){
          this.$message.success("删除成功")
          this.loadUserList()
        }
      })
    }
  }
}
</script>

<style scoped>
/* 完全对齐你的静态HTML原型样式，JS逻辑完全不动 */
.page {
  padding: 0;
}
h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #222;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* 原型里的panel白色圆角阴影卡片 */
.panel {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.search-form {
  margin-bottom:0;
}

.table-wrap {
  padding:20px;
}

/* 修改element表格外观贴近原生原型表格 */
:deep(.my-table .el-table__header th) {
  background-color: #f7f9f8;
  color:#333;
}
:deep(.my-table) {
  border-radius: 10px;
  overflow:hidden;
}

.my-pagination {
  margin-top:16px;
  display:flex;
  justify-content:flex-end;
}

/* 修改按钮主色为原型绿色 #347c60 */
:deep(.el-button--primary) {
  background-color: #347c60;
  border-color: #347c60;
}
:deep(.el-button--primary:hover) {
  background-color: #28604b;
  border-color: #28604b;
}
</style>