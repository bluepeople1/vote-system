// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
const Vue = require('vue')
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import jquery from 'jquery'
import './assets/css/weui.min.css'
import './assets/css/common.css'
import vueLazyLoad from 'vue-lazyload'
import stores from './store/index'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// require styles
import 'swiper/dist/css/swiper.css'
import VueVideoPlayer from 'vue-video-player'
// require videojs style
import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'

Vue.use(VueVideoPlayer, /* {
  options: global default options,
  events: global videojs events
} */)

Vue.use(VueAwesomeSwiper, /* { default global options } */)

Vue.use(vueLazyLoad, {
  preLoad: 1.3,
  error: require('./assets/img/errorImg.png'),
  loading: require('./assets/img/loading.gif'),
  attempt:3
})
Vue.use(VueAxios, axios)

Vue.use(VueAxios, axios)
/*
*  1.超时处理
*  2.post设置
*  3.开发环境与正式环境的区别
*/
axios.defaults.timeout = 15000
// axios.defaults.baseURL =  'http://www.hzrtpxt.top/'
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // console.log('发请求')
  stores.dispatch('loading', {
    isShow: true,
    content: '正在火速加载中...'
  })
  // 在发送请求之前做些什么
  // config.headers = {
  //   'SessionId': stores.getters.config._sessionId
  // }
  return config
}, function (error) {
  // 对请求错误做些什么
  stores.dispatch('hideLoading')
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log('请求回来')
  stores.dispatch('hideLoading')
  // 对响应数据做点什么
  // if (response.data.code === 1000) {
  //   login(res => {
  //     sessionStorage.setItem('sessionId', res.data.sessionid);
  //   });
  // }
  return response.data
}, function (error) {
  // 对响应错误做点什么
  stores.dispatch('hideLoading')
  return Promise.reject(error)
})
Vue.prototype.$jquery = jquery
// Vue.prototype.$http = axios
Vue.config.productionTip = false

// console.log(stores)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: stores,
  components: {App},
  template: '<App/>'
})
