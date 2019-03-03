<template>
  <div id="container">
    <div style="width: 100%">
      <my-marquee :content="title"></my-marquee>
    </div>
    <keep-alive>
      <router-view class="child"/>
    </keep-alive>
    <div id="tabBar">
      <ul class="tab">
        <li>
          <router-link :to="{name:'Index'}" tag="div" class="li-item">
            <img :src="(selectedTab===1)?selectImg.index.selected:selectImg.index.unselected" class="li-item-icon"/>
            <span :class="(selectedTab===1)?'selected-tab-font':'unselected-tab-font'">首页</span>
          </router-link>
        </li>
        <li>
          <router-link to="/prize" tag="div" class="li-item">
            <img :src="(selectedTab === 2) ? selectImg.prize.selected : selectImg.prize.unselected" class="li-item-icon"/>
            <span :class="(selectedTab === 2)? 'selected-tab-font' : 'unselected-tab-font'">奖品</span>
          </router-link>
        </li>
        <li>
          <router-link to="/list" tag="div" class="li-item">
            <img :src="(selectedTab===3) ? selectImg.list.selected : selectImg.list.unselected" class="li-item-icon"/>
            <span :class="(selectedTab===3)?'selected-tab-font':'unselected-tab-font'">排行榜</span>
          </router-link>
        </li>
        <li>
          <router-link to="/register" tag="div" class="li-item">
            <img :src="(selectedTab===4) ? selectImg.register.selected : selectImg.register.unselected"
                 class="li-item-icon"/>
            <span :class="(selectedTab===4)?'selected-tab-font':'unselected-tab-font'">报名</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import apiService from '@/api/Service'
import {signs} from '@/assets/js/sign'
import wx from 'weixin-js-sdk'
import MusicPlayer from './common/MusicPlayer'
import MyMarquee from './common/MyMarquee'
import CommonService from '@/assets/js/common'

export default {
  components: {MusicPlayer, MyMarquee},
  data () {
    return {
      selectImg: {
        index: {
          selected: require('../assets/img/index_selected.png'),
          unselected: require('../assets/img/index_unselected.png')
        },
        prize: {
          selected: require('../assets/img/prize_selected.png'),
          unselected: require('../assets/img/prize_unselected.png')
        }
        ,
        list: {
          selected: require('../assets/img/ranking_list_selected.png'),
          unselected: require('../assets/img/ranking_list_unselected.png')
        },
        register: {
          selected: require('../assets/img/apply_selected.png'),
          unselected: require('../assets/img/apply_unselected.png')
        }
      },
      selectedTab: 1
    }
  },
  created: function () {
    //页面刷新后，判断当前页面所在tab
    this.currentTab()
    this.init()
    //this.device();
  },
  methods: {
    init () {
      if (!(this.config.activityId && this.config.loginId)) {
        let activityId = this.$route.query.activityId
        let loginId = this.$route.query.loginId
        let sharedUrl = 'http://www.yaqinkeji.top/homeschool/wxInterface/wxToGrantAuthorization?aid=' + activityId + '&bid=' + loginId
        let map = new Map()
        map.set('nickName', this.$route.query.nickname || '')
        map.set('headImgUrl', this.$route.query.headimgurl || '')
        map.set('openId', this.$route.query.openId)
        map.set('loginId', loginId)
        map.set('sharedUrl', sharedUrl)
        map.set('activityId', activityId)
        this.$store.dispatch('config', map)
        this.loadData()
      }
    },
    loadData () {
      let data = {
        loginId: this.config.loginId, // 登录用户Id
        activityId: this.config.activityId // 当前所在活动Id
      }
      let ajaxArr = [
        this.getMusic(this, data),
        this.getCurrentActivityInfo(this, data),
        this.getJsTicketAndToken(this, data)
      ]
      Promise.all(ajaxArr).then(data => {
        console.log(data)
        let m = new Map()
        m.set('activityInfo', data[1].resultObject)
        // m.set('musicUrl', 'https://www.yaqinkeji.top' + data[0].resultObject.musicPath)
        m.set('musicUrl', data[0].resultObject.musicPath)
        document.title = data[1].resultObject.ActivityInfo.activityName
        this.$store.dispatch('config', m)
        this.setWxShareConfig(data[2].resultObject, data[1].resultObject.ActivityInfo)
      }, error => {
        console.log(error)
      })
    },
    /**
     * 获取活动背景音乐
     */
    getMusic (that, params) {
      return new Promise(function (resolve, reject) {
        apiService.getActivityMusic(that, params).then(success => {
          return resolve(success)
        }, err => {
          return reject(err)
        })
      })

    },
    /**
     * 获取当前活动的信息
     * @param that
     * @param params
     * @response resultNumber 0:成功 非0:失败
     * @response resultMsg 结果消息
     * @response resultObject.studentCount 报名个数
     * @response resultObject.studentTicketCount 总票数
     * @response resultObject.ActivityBrowseVolume 浏览量
     * @response resultObject.id 活动id
     * @response resultObject.activityName 活动名
     * @response resultObject.activityContent 活动内容
     * @response resultObject.activityStartTime 开始时间
     * @response resultObject.activityEndTime 结束时间
     * @response resultObject.onlineApplication 0-允许在线报名 1-不允许
     */
    getCurrentActivityInfo (that, params) {
      return new Promise(function (resolve, reject) {
        apiService.getActiityInfo(that, params).then(success => {
          return resolve(success)
        }, err => {
          return reject(err)
        })
      })
    },
    /**
     * 获取微信 js_ticket 和 token
     */
    getJsTicketAndToken (that, data) {
      return new Promise(function (resolve, reject) {
        apiService.getTokenAndTicket(that, data).then(success => {
          return resolve(success)
        }, err => {
          return reject(err)
        })
      })
    },
    /**
     * 微信分享配置信息
     * @param data
     * @param activityInfo
     */
    setWxShareConfig (data, activityInfo) {
      const config = signs(data.jsapi_ticket, window.location.href.split('#')[0])
      wx.config({
        debug: false,
        appId: this.config.appId,
        timestamp: config.timestamp,
        nonceStr: config.noncestr,
        signature: config.signature,
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          // 'updateAppMessageShareData',
          // 'updateTimelineShareData'
        ]
      })
      let shareConfig = {
        title: activityInfo.activityName, // 分享标题
        desc: activityInfo.activityContent || '我们正在做活动，快点进来看看吧！',
        link: this.config.sharedUrl, // 分享链接
        imgUrl: data.headImgUrl || '', // 分享图标
        success: function () {
          // console.log('成功');
        },
        cancel: function () {
          // alert('失败');
        }
      }
      wx.ready(function () {
        wx.onMenuShareTimeline(shareConfig)
        wx.onMenuShareAppMessage(shareConfig)
        // wx.updateAppMessageShareData(shareConfig)
        // wx.updateTimelineShareData(shareConfig)
      })
    },
    shareUrlParamsFilter (s) {
      // 过滤掉pay，openId参数
      return s.replace(/&pay=\w+/, '').replace(/[(\?)|(&)]openId=.*/, '')
    },
    currentTab: function () {
      const href = window.location.href
      const currentPage = href.split('/#/')[1]
      switch (currentPage) {
        case 'Index':
          this.changeTab(1)
          return
        case 'prize':
          this.changeTab(2)
          return
        case 'list':
          this.changeTab(3)
          return
        case 'register':
          this.changeTab(4)
          return
      }
    },
    changeTab: function (tab) {
      this.selectedTab = tab
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        let tab = val.name
        if (tab === 'Index') {
          this.changeTab(1)
        } else if (tab === 'Prize') {
          this.changeTab(2)
        } else if (tab === 'List') {
          this.changeTab(3)
        } else if (tab === 'Register') {
          this.changeTab(4)
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  computed: {
    config () {
      return this.$store.getters.config
    },
    title () {
      if (Object.keys(this.config.activityInfo).length !== 0) {
        let activityName = this.config.activityInfo.ActivityInfo.activityName
        let activityStartTime = this.config.activityInfo.ActivityInfo.activityStartTime
        let activityEndTime = this.config.activityInfo.ActivityInfo.activityEndTime
        if (activityName && activityStartTime && activityEndTime) {
          return activityName + '  活动时间：' + activityStartTime + ' ~ ' + activityEndTime
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  ul {
    list-style: none;
  }

  .tab {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 50px;
  }

  li {
    width: 30%;
    font-size: 10px;
  }

  .selected-tab-font {
    color: #09bb07;
  }

  .unselected-tab-font {
    color: #808080;
  }

  .li-item {
    height: 55px;
    display: flex;
    display: -webkit-inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .li-item-icon {
    width: 25px;
    height: 25px;
  }

  #tabBar {
    width: 100%;
    background: #f7f7fa;
    position: fixed;
    bottom: 0;
    margin: 0;
    z-index: 1000;
    border-top: 1px solid #e2e2e2;
  }
</style>
