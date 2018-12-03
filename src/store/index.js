import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const stores = new Vuex.Store({
  state: {
    isShowLoading: false
  },
  getters: {
    isShowLoading: state => {
      return state.isShowLoading
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
    }
  }
})

export default stores
