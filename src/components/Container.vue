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
          <router-link :to="{name:'Index',params:{uuid: uuid}}" tag="div" class="li-item">
            <img :src="(selectedTab===1)?selectImg.index.selected:selectImg.index.unselected" class="li-item-icon"/>
            <span :class="(selectedTab===1)?'selected-tab-font':'unselected-tab-font'">首页</span>
          </router-link>
        </li>
        <li>
          <router-link to="/prize" tag="div" class="li-item">
            <img :src="(selectedTab===2)?selectImg.prize.selected:selectImg.prize.unselected" class="li-item-icon"/>
            <span :class="(selectedTab===2)?'selected-tab-font':'unselected-tab-font'">奖品</span>
          </router-link>
        </li>
        <li>
          <router-link to="/list" tag="div" class="li-item">
            <img :src="(selectedTab===3)?selectImg.list.selected:selectImg.list.unselected" class="li-item-icon"/>
            <span :class="(selectedTab===3)?'selected-tab-font':'unselected-tab-font'">排行榜</span>
          </router-link>
        </li>
        <li>
          <router-link to="/register" tag="div" class="li-item">
            <img :src="(selectedTab===4)?selectImg.register.selected:selectImg.register.unselected"
                 class="li-item-icon"/>
            <span :class="(selectedTab===4)?'selected-tab-font':'unselected-tab-font'">报名</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { wxlogin, login, getActivityInfo, wxAuth, getJsApiTicket, newLogin, getActivityImg } from '@/api/Service'
  import { signs } from '@/assets/js/sign'
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
        selectedTab: 1,
        uuid: '',
        activityInfo: ''
      }
    },
    created: function () {
      let that = this
      //页面刷新后，判断当前页面所在tab
      // this.currentTab()
      if (!this.config._uuid) {
        //如果uuid不存在，就从url中截取
        let path = window.location.href.split('/index/')[1]
        let params = path.split('&')
        let openId = params[0].split('=')[1]
        let uuid = params[1].split('=')[1]
        let nickName = decodeURI(params[2].split('=')[1])
        let headImgUrl = decodeURIComponent(params[3].split('=')[1])
        let sex = (params[4].split('=')[1]) === '1' ? '男' : '女'
        let sharedUrl = 'http://www.hzrtpxt.top/master/wxlogin?uuid=' + uuid
        let map =new Map()
        map.set("_wxUserInfo",{
          nickName: nickName,
          headImgUrl: headImgUrl,
          sex: sex
        })
        map.set("_openId",openId)
        map.set("_uuid",uuid)
        map.set("_sharedUrl",sharedUrl)
        this.$store.dispatch('config', map)
        console.log(this.$store.getters.config)
      }
      newLogin(function (data) {
        that.activityInfo = data
        //设置显示标题
        document.title = that.config._activity.activeName
        getActivityImg({activeName: that.config._activity.activeName}, res => {
          console.log('getActivityImg')
          if (res.data.length !== 0) {
            this.$store.dispatch('config', new Map().set("_sharedImg",res.data[0].imgSource))
          }
          getJsApiTicket(function (res) {
            const config = signs(res.data.jsapi_ticket, window.location.href.split('#')[0])
            wx.config({
              debug: false,
              appId: that.config._appId,
              timestamp: config.timestamp,
              nonceStr: config.noncestr,
              signature: config.signature,
              jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'updateAppMessageShareData',
                'updateTimelineShareData'
              ]
            })
            let shareConfig = {
              title: that.config._activity.activeName, // 分享标题
              desc: that.config._activity.activeContext || '我们正在做活动，快点进来看看吧！',
              link: that.config._sharedUrl, // 分享链接
              imgUrl: that.config._img_url + that.config._state.sharedImg, // 分享图标
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
              wx.updateAppMessageShareData(shareConfig)
              wx.updateTimelineShareData(shareConfig)
            })
          })
        })
      })
      //this.device();
    },
    methods: {
      shareUrlParamsFilter(s){
        // 过滤掉pay，openId参数
        return s.replace(/&pay=\w+/, '').replace(/[(\?)|(&)]openId=.*/, '');
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
      config(){
        return this.$store.getters.config
      },
      title () {
        let str = ''
        if (this.activityInfo.activeName && this.activityInfo.activeBegintime && this.activityInfo.activeEndtime) {
          str = this.activityInfo.activeName + '  活动时间：' + this.activityInfo.activeBegintime + ' ~ ' + this.activityInfo.activeEndtime
        }
        return str
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
