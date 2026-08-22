import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/Login.vue")
  },
  {
    path: '/',
    component: () => import("@/views/MainLayout.vue"),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: () => import("@/views/Dashboard.vue"), meta: { title: "仪表盘" } },
      // ✅ 修改子路由path为 user，和侧边栏to="/user"对应
      { path: 'user', component: () => import("@/views/UserManage.vue"), meta: { title: "用户管理" } },
      { path: 'material', component: () => import("@/views/MaterialManage.vue"), meta: { title: "物料管理" } },
      { path: 'inbill', component: () => import("@/views/InBill.vue"), meta: { title: "入库单据" } },
      { path: 'outbill', component: () => import("@/views/OutBill.vue"), meta: { title: "出库单据" } },
      { path: 'stocklog', component: () => import("@/views/StockLog.vue"), meta: { title: "库存流水" } },
      { path: 'setting', component: () => import("@/views/Setting.vue"), meta: { title: "系统设置" } }
    ]
  },
  {
    path: '*',
    redirect: '/login'
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})
// 全局路由守卫，检查token是否存在
router.beforeEach((to, from, next) => {
  // 读取token，后端返回的jwt凭证
  const token = localStorage.getItem('token')

  // 如果去登录页面
  if (to.path === '/login') {
    if (token) {
      // 已经登录，直接去仪表盘
      next('/dashboard')
    } else {
      next()
    }
  } else {
    //访问其他所有页面：仪表盘/用户管理等
    if (token) {
      next() //放行
    } else {
      next('/login') //没有token打回登录
    }
  }
})
export default router