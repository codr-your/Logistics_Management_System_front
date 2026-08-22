<template>
  <div class="layout-wrap">
    <!-- 左侧侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-title">仓库管理系统</div>
      <ul class="sidebar-menu">
        <li>
          <router-link to="/dashboard" class="menu-item" active-class="active">📊 仪表盘</router-link>
        </li>
        <li>
          <router-link to="/user" class="menu-item" active-class="active">👤 用户管理</router-link>
        </li>
        <li>
          <router-link to="/material" class="menu-item" active-class="active">📦 物料管理</router-link>
        </li>
        <li>
          <router-link to="/inbill" class="menu-item" active-class="active">📥 入库单据</router-link>
        </li>
        <li>
          <router-link to="/outbill" class="menu-item" active-class="active">📤 出库单据</router-link>
        </li>
        <li>
          <router-link to="/stocklog" class="menu-item" active-class="active">📋 库存记录</router-link>
        </li>
        <li>
          <router-link to="/setting" class="menu-item" active-class="active">⚙️ 系统设置</router-link>
        </li>
      </ul>
    </div>

    <div class="main-wrap">
      <!-- 顶部导航 -->
      <div class="header-top">
        <div>欢迎使用物料出入库管理系统</div>
        <div class="header-user">
          <span>管理员‑{{userName}}</span>
          <span>🔔</span>
          <span class="logout-btn" @click="handleLogout">🚪退出</span>
        </div>
      </div>
      <!-- 子页面渲染出口：增加key，路由切换强制重建组件 -->
      <div class="page-content">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"MainLayout",
  data(){
    return {
      userName:""
    }
  },
  created() {
    // 从localStorage拿用户名（登录时存入）
    this.userName = localStorage.getItem("username") || "未知用户"
  },
  methods:{
    handleLogout(){
      // JWT退出：清空token+用户名
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
.layout-wrap{
  display:flex;
  height:100vh;
  margin:0;
  padding:0;
  font-family: "Microsoft YaHei", sans-serif;
}
/* 左侧侧边栏 */
.sidebar {
  width: 240px;
  background-color: #347c60;
  color: #ffffff;
  padding-top: 24px;
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 36px;
}

.sidebar-menu li {
  list-style: none;
}

.sidebar-menu a {
  display: block;
  color: #fff;
  text-decoration: none;
  padding: 14px 28px;
  transition: 0.2s;
  cursor: pointer;
}

.sidebar-menu a.active {
  background-color: #28604b;
}

.sidebar-menu a:hover {
  background-color: #28604b;
}

/* 主内容区域 */
.main-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color:#f3f6f9;
}

/* 顶部导航 */
.header-top {
  height: 60px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logout-btn{
  cursor:pointer;
}
.page-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}
</style>