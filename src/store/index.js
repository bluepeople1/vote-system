// import Vue from 'vue'
const Vue = require('vue')
import Vuex from 'vuex'

Vue.use(Vuex)
// noinspection JSAnnotator
const stores = new Vuex.Store({
  state: {
    config: {
      prefix: 'http://www.hzrtpxt.top/',
      // prefix: 'http://www.yaqinkeji.top/',
      userId: '1673235257996760', // 黄
      // userId: '1767548054776104', // 毛
      oss: {
        // 黄
        region: 'oss-cn-shanghai',
        accessKeyId: 'LTAI89GHj1gjSXVX',
        accessKeySecret: '3qQWPLKyOBxdah1A6gcwjN9gcYs6ij',
        bucket: 'liuxianzhihe',
        // 毛
        // region: 'oss-cn-shanghai',
        // accessKeyId: 'LTAIQ4GpUKhm8SV4',
        // accessKeySecret: 'rWnaH83ydq5NSpVTLcFUwWrBU218JI',
        // bucket: 'my-img-bucket',
      },
      appId: 'wxb36f7c6095549952',// 黄
      // appId: 'wx244b2b17c6b7901f',// 毛
      nickName: '',
      headImgUrl: '',
      loginId: '',
      openId: '',
      activityId: '',
      jsApiTicket: '',
      sharedUrl: '',
      sharedImg: '',
      activityInfo: {},
      musicUrl: null,
      studentCode: 0,
      set setParams (d) {
        for (let [key, value] of d) {
          this[key] = value
        }
      }
    },
    loading: {
      isShow: false,
      content: '正在火速加载中...'
    },
    isPlay: false // 音乐的播放暂停
  },
  getters: {
    /**
     * 返回loading状态
     * @param state
     * @returns {getters.isShowLoading|(function(*))|boolean|*|default.computed.isShowLoading|m.computed.isShowLoading}
     */
    loadingInfo: state => {
      return state.loading
    },
    /**
     * 返回播放状态
     * @param state
     * @returns {getters.isPlay|(function(*))|boolean|*}
     */
    isPlay: state => {
      return state.isPlay
    },
    config: state => {
      return state.config
    }
  },
  mutations: {
    config (state, data) {
      state.config.setParams = data
    },
    loading (state, data) {
      state.loading = {
        isShow: data.isShow,
        content: data.content
      }
    },
    /**
     * 隐藏loading
     * @param state
     */
    hideLoading (state) {
      state.loading.isShow = false
    },
    /**
     * 播放/暂停音乐
     * @param state
     */
    playOrPausePlayer (state) {
      state.isPlay = !state.isPlay
    }
  },
  actions: {
    config (context, data) {
      context.commit('config', data)
    },
    loading (context, content) {
      context.commit('loading', content)
    },
    /**
     * 隐藏loading
     * @param context
     */
    hideLoading (context) {
      context.commit('hideLoading')
    },
    /**
     * 提交播放/暂停音乐动作
     * @param context
     */
    playOrPausePlayer (context) {
      context.commit('playOrPausePlayer')
    }
  }
})

export default stores
