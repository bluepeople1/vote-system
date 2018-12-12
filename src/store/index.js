import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const stores = new Vuex.Store({
  state: {
    isShowLoading: false,
    isPlay: true// 音乐的播放暂停
  },
  getters: {
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
    }
  },
  mutations: {
    /**
     * 显示或者隐藏Loading
     * @param state
     */
    showOrHideLoading (state) {
      state.isShowLoading = !state.isShowLoading
    },
    showLoading (state) {
      state.isShowLoading = true
    },
    hideLoading (state) {
      state.isShowLoading = false
    }
    ,
    /**
     * 播放/暂停音乐
     * @param state
     */
    playOrPausePlayer (state) {
      state.isPlay = !state.isPlay
    }
  },
  actions: {
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
    showLoading(context){
      context.commit('showLoading')
    },
    /**
     * 隐藏loading
     * @param context
     */
    hideLoading(context){
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
