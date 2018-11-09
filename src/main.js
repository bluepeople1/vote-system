// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import $ from 'jquery';
import {login} from '@/api/Service';
import './assets/css/weui.min.css';
import './assets/css/common.css';


/*
*  1.超时处理
*  2.post设置
*  3.开发环境与正式环境的区别
*/
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL =  (process.env.NODE_ENV == 'development' ? 'http://192.168.1.15:8080/' : 'http://www.xxxx.com/')


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (sessionStorage.getItem('sessionId')) {
    config.headers = {
      'SessionId': sessionStorage.getItem('sessionId')
    };
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log(response.data);
  if (response.data.code === 1000) {
    login(res => {
      console.log(res.data.sessionid);
      sessionStorage.setItem('sessionId', res.data.sessionid);
    });
  }
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
