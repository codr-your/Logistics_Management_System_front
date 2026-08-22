import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import * as echarts from 'echarts'
import '@/assets/global.css'


Vue.use(ElementUI)
//配置axios后端基础地址，你的后端端口8081
axios.defaults.baseURL = 'http://127.0.0.1:8081'
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
