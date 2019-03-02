import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// noinspection JSAnnotator
const stores = new Vuex.Store({
  state: {
    config: {
      appId: 'wx244b2b17c6b7901f',
      nickName: '',
      headImgUrl: '',
      loginId: '',
      openId: '',
      activityId: '',
      jsApiTicket: '',
      sharedUrl: '',
      sharedImg: '',
      activityInfo: {},
      base_url: 'https://www.hzrtpxt.top/nserver',
      img_url: 'http://www.yaqinkeji.top',
      musicUrl: null,
      set setParams (d) {
        for (let [key, value] of d) {
          this[key] = value
        }
      }
    },
    isShowLoading: false,
    isPlay: true// 音乐的播放暂停
  },
  getters: {
    /**
     * 返回loading状态
     * @param state
     * @returns {getters.isShowLoading|(function(*))|boolean|*|default.computed.isShowLoading|m.computed.isShowLoading}
     */
    isShowLoading: state => {
      return state.isShowLoading
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
    /**
     * 显示或者隐藏Loading
     * @param state
     */
    showOrHideLoading (state) {
      state.isShowLoading = !state.isShowLoading
    },
    /**
     * 显示loading
     * @param state
     */
    showLoading (state) {
      state.isShowLoading = true
    },
    /**
     * 隐藏loading
     * @param state
     */
    hideLoading (state) {
      state.isShowLoading = false
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
    /**
     * 提交显示或者隐藏Loading动作
     * @param context
     */
    showOrHideLoading (context) {
      context.commit('showOrHideLoading')
    },
    /**
     * 显示loading
     * @param context
     */
    showLoading (context) {
      context.commit('showLoading')
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
