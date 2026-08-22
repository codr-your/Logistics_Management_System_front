// src/utils/request.js
import axios from 'axios'
// 创建axios实例
const service = axios.create({
    baseURL: 'http://127.0.0.1:8081', // SpringBoot后端地址，根据你实际后端端口修改
    timeout: 5000 // 请求超时时间
})
// 请求拦截：把token放到header
service.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.token = token
    }
    return config
}, error => {
    return Promise.reject(error)
})

//响应拦截，捕获401未授权，跳转到登录页
service.interceptors.response.use(response => {
    return response.data
}, error => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token')
        //跳登录
        location.href = "/#/login"
    }
    return Promise.reject(error)
})

export default service