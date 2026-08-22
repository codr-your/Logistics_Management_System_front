<template>
  <div class="login-page">
    <div class="login-wrap">
      <!-- 左侧项目介绍区域 -->
      <div class="login-left">
        <div class="brand-content">
          <h1>物料出入库管理系统</h1>
          <p>Warehouse Material Management System</p>
          <div class="divider"></div>
          <p class="desc">
            实现物料入库、出库、库存统计、单据管理等核心业务，简化仓库日常管理流程。
          </p>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-right">
        <div class="form-card">
          <div class="tab-group">
            <!-- ✅统一变量 loginTab true=登录 false=注册 -->
            <span class="tab" :class="{active: loginTab}" @click="loginTab = true">登录</span>
            <span class="tab" :class="{active: !loginTab}" @click="loginTab = false">注册</span>
          </div>

          <!-- 登录表单 -->
          <div v-if="loginTab" class="form-item">
            <el-form ref="loginRef" :model="loginForm" label-width="0px">
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="submit-btn" @click="handleLogin">登录系统</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 注册表单 ✅全部改为 registerForm，和data对应 -->
          <div v-else class="form-item">
            <el-form ref="regRef" :model="registerForm" label-width="0px">
              <el-form-item prop="username">
                <el-input v-model="registerForm.username" placeholder="设置用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="registerForm.password" type="password" placeholder="设置密码" show-password></el-input>
              </el-form-item>
              <el-form-item prop="rePassword">
                <el-input v-model="registerForm.rePassword" type="password" placeholder="确认密码" show-password></el-input>
              </el-form-item>
              <el-form-item prop="realName">
                <el-input v-model="registerForm.realName" placeholder="填写真实姓名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="submit-btn" @click="handleRegister">创建账号</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request"
export default {
  name:"Login",
  data(){
    return {
      loginTab: true, // true登录，false注册，模板使用这个变量
      loginForm:{
        username:"",
        password:""
      },
      registerForm:{
        username:"",
        password:"",
        rePassword:"",
        realName:""
      }
    }
  },
  methods:{
    async handleLogin(){
      if(!this.loginForm.username || !this.loginForm.password){
        this.$message.warning("用户名和密码不能为空")
        return
      }
      try{
        const res = await request.post("/user/login",this.loginForm)
        console.log("登录返回：",res)
        if(res.code === 200){
          
           localStorage.setItem("token", res.data)
           this.$message.success("登录成功")
           this.$router.push("/dashboard")
        }else{
          this.$message.error(res.msg || "账号密码错误")
        }
      }catch (e){
        this.$message.error("后端接口请求失败，请检查SpringBoot服务是否启动")
      }
    },
    async handleRegister(){
      if(!this.registerForm.username || !this.registerForm.password){
        this.$message.warning("用户名密码不能为空")
        return
      }
      if(this.registerForm.password !== this.registerForm.rePassword){
        this.$message.warning("两次输入密码不一致！")
        return
      }
      try{
        const res = await request.post("/user/add",{
          username:this.registerForm.username,
          password:this.registerForm.password,
          realName:this.registerForm.realName,
          role:2,
          status:1
        })
        if(res.code ===200){
          this.$message.success("注册成功，请前往登录")
          this.loginTab = true //注册完成切回登录tab
          //清空注册表单
          this.registerForm = {username:"",password:"",rePassword:"",realName:""}
        }else{
          this.$message.error(res.msg || "注册失败")
        }
      }catch (e){
        this.$message.error("注册接口异常")
      }
    }
  }
}
</script>

<style scoped>
.login-page{
  width:100%;
  height:100vh;
  background: #f3f6f9;
  display:flex;
  justify-content:center;
  align-items:center;
  margin:0;
}
.login-wrap{
  width:920px;
  height:520px;
  display:flex;
  border-radius:16px;
  overflow:hidden;
  box-shadow: 0 12px 40px rgba(36, 124, 96,0.18);
}
/* 左侧绿色区域，和主界面侧边栏统一主题 */
.login-left{
  width:44%;
  background: linear-gradient(160deg,#347c60,#28604b);
  color:#ffffff;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:0 40px;
}
.brand-content h1{
  font-size:28px;
  margin:0 0 8px;
  font-weight:600;
}
.brand-content p{
  font-size:15px;
  opacity:0.85;
}
.divider{
  width:70px;
  height:3px;
  background:#fff;
  margin:24px 0;
  border-radius:3px;
}
.desc{
  line-height:1.8;
  font-size:14px;
  opacity:0.8;
}

/* 右侧表单卡片 */
.login-right{
  width:56%;
  background:#ffffff;
  display:flex;
  align-items:center;
  justify-content:center;
}
.form-card{
  width:75%;
}
.tab-group{
  display:flex;
  margin-bottom:30px;
}
.tab{
  font-size:18px;
  margin-right:36px;
  cursor:pointer;
  color:#888;
  padding-bottom:8px;
  border-bottom:2px solid transparent;
  transition:0.25s;
}
.tab.active{
  color:#347c60;
  border-bottom:2px solid #347c60;
}
.submit-btn{
  width:100%;
  height:44px;
  background:#347c60 !important;
  border:none !important;
  font-size:16px;
}
.submit-btn:hover{
  background:#28604b !important;
}
</style>