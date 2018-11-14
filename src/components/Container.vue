<template>
  <div id="container">
    <!-- {{wxcode}} -->
    <div class="marquee-title">
      <marquee>{{activityInfo.activeName?activityInfo.activeName:''}}
        活动时间：{{activityInfo.activeBegintime?activityInfo.activeBegintime:''}} ~
        {{activityInfo.activeEndtime?activityInfo.activeEndtime:''}}</marquee>
    </div>
    <keep-alive>
      <router-view class="child"/>
    </keep-alive>
    <div id="tabBar">
      <ul class="tab">
        <li>
          <router-link v-if="selectedTab===1" :to="{name:'Index',params:{uuid: uuid}}" tag="div" class="li-item">
            <img src="../assets/img/index_selected.png" class="li-item-icon"/>
            <span class="selected-tab-font">首页</span>
          </router-link>
          <router-link v-else :to="{name:'Index',params:{uuid: uuid}}" tag="div" class="li-item">
            <img src="../assets/img/index_unselected.png" class="li-item-icon"/>
            <span class="unselected-tab-font">首页</span>
          </router-link>
        </li>
        <li>
          <router-link v-if="selectedTab===2" to="/prize" tag="div" class="li-item">
            <img src="../assets/img/prize_selected.png" class="li-item-icon"/>
            <span class="selected-tab-font">奖品</span>
          </router-link>
          <router-link v-else to="/prize" tag="div" class="li-item">
            <img src="../assets/img/prize_unselected.png" class="li-item-icon"/>
            <span class="unselected-tab-font">奖品</span>
          </router-link>
        </li>
        <li>
          <router-link v-if="selectedTab===3" to="/list" tag="div" class="li-item">
            <img src="../assets/img/ranking_list_selected.png" class="li-item-icon"/>
            <span class="selected-tab-font">排行榜</span>
          </router-link>
          <router-link v-else to="/list" tag="div" class="li-item">
            <img src="../assets/img/ranking_list_unselected.png" class="li-item-icon"/>
            <span class="unselected-tab-font">排行榜</span>
          </router-link>
        </li>
        <li>
          <router-link v-if="selectedTab===4" to="/register" tag="div" class="li-item">
            <img src="../assets/img/apply_selected.png" class="li-item-icon"/>
            <span class="selected-tab-font">报名</span>
          </router-link>
          <router-link v-else to="/register" tag="div" class="li-item">
            <img src="../assets/img/apply_unselected.png" class="li-item-icon"/>
            <span class="unselected-tab-font">报名</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { wxlogin, login, getActivityInfo, wxAuth, getJsApiTicket,newLogin } from '@/api/Service';
  import { sign } from '@/assets/js/sign';
  import store from '@/assets/js/store';
  import wx from 'weixin-js-sdk';

  let Base64 = require('js-base64').Base64;

  export default {
    data () {
      return {
        selectedTab: 1,
        uuid: '',
        activityInfo: '',
        activityName: '',
        activityBeginTime: '',
        activityEndTime: ''
      };
    },
    created: function () {
      console.log(store)
      //页面刷新后，判断当前页面所在tab
      this.currentTab();
      if (store.state.uuid==='') {
        //如果uuid不存在，就从url中截取
        let url = window.location.href.split('#')[1];
        let data = Base64.decode(url.split('/')[2]);
        let openId = data.split('#')[0].split('=')[1];
        let uuid = data.split('#')[1].split('=')[1];
        let sharedUrl = 'http://www.hzrtpxt.top/master/wxlogin?uuid=' + uuid;
        store.setOpenId(openId);
        store.setUuid(uuid);
        store.setSharedUrl(sharedUrl);
      }

      const that = this;
      //用户登录，获取sessionid
      login(res => {
        store.setSessionId(res.data.sessionid);
        that.getDataList();
      });

      //this.device();
    },
    mounted: function () {
      if (window.history && window.history.pushState) {
        window.addEventListener('popstate',function () {
          window.history.pushState('forward', null, '#');
          window.history.forward(1);
        })
      }
      window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
      window.history.forward(1);
    },
    methods: {
      currentTab: function () {
        const href = window.location.href;
        const currentPage = href.split('/#/')[1];
        switch (currentPage) {
          case 'Index':
            this.changeTab(1);
            return;
          case 'prize':
            this.changeTab(2);
            return;
          case 'list':
            this.changeTab(3);
            return;
          case 'register':
            this.changeTab(4);
            return;
        }
      },
      changeTab: function (tab) {
        this.selectedTab = tab;
      },
      //获取数据
      getDataList: function () {
        const that = this;
        let params = {
          uuid: store.state.uuid
        };
        //获取活动信息
        getActivityInfo(params, res => {
          let data = res.data[0];
          console.log(data)
          if (data) {
            that.activityInfo = data;
            store.setActivity({
              activityName: data.activeName,
              activityBeginTime: data.activeBegintime,
              activityEndTime: data.activeEndtime
            });

            this.$http.get(store.base_url + '/getTicket').then((res) => {
              console.log('getJsapiTicket', res);
              store.setJsApiTicket(res.data.jsapi_ticket);
              const config = sign(res.data.jsapi_ticket, window.location.href.split('#')[0]);
              // 配置功能
              wx.config({
                debug: true,
                appId: store.state.appId,
                timestamp: config.timestamp,
                nonceStr: config.noncestr,
                signature: config.signature,
                jsApiList: [
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage',
                  'updateAppMessageShareData',
                  'updateTimelineShareData'
                ]
              });

              wx.ready(function () {
                wx.onMenuShareTimeline({
                  title: store.state.activity.activityName, // 分享标题
                  desc: '正在做活动，快点进来看看吧！',
                  link: store.state.sharedUrl, // 分享链接
                  imgUrl: 'https://tup.iheima.com/sport.png', // 分享图标
                  success: function () {
                    alert('成功');
                  },
                  cancel: function () {
                    alert('失败');
                  }
                });
                wx.onMenuShareAppMessage({
                  title: store.state.activity.activityName, // 分享标题
                  desc: '正在做活动，快点进来看看吧！',
                  link: store.state.sharedUrl, // 分享链接
                  imgUrl: 'https://tup.iheima.com/sport.png', // 分享图标
                  success: function () {
                    alert('成功');
                  },
                  cancel: function () {
                    alert('失败');
                  }
                });
                wx.updateAppMessageShareData({
                  title: store.state.activity.activityName, // 分享标题
                  desc: '正在做活动，快点进来看看吧！',
                  link: store.state.sharedUrl, // 分享链接
                  imgUrl: 'https://tup.iheima.com/sport.png', // 分享图标
                  success: function () {
                    alert('成功');
                  },
                  cancel: function () {
                    alert('失败');
                  }
                });

                wx.updateTimelineShareData({
                  title: store.state.activity.activityName, // 分享标题
                  desc: '正在做活动，快点进来看看吧！',
                  link: store.state.sharedUrl, // 分享链接
                  imgUrl: 'https://tup.iheima.com/sport.png', // 分享图标
                  success: function () {
                    alert('成功');
                  },
                  cancel: function () {
                    alert('失败');
                  }
                });

              });
            });
          } else {
            console.log('暂无数据');
          }
        });
      },
      //判断是什么设备打开的网页
      device: function () {
        if (navigator.appVersion.includes('iPhone')) {
          console.log('iPhone');
        } else if (navigator.appVersion.includes('Android')) {
          console.log('Android');
        } else if (
          navigator.appVersion.includes('MicroMessenger')
        //   (navigator.appVersion.includes("MicroMessenger") &&
        //     navigator.appVersion.includes("iPhone")) ||
        //   (navigator.appVersion.includes("MicroMessenger") &&
        //     navigator.appVersion.includes("Android"))
        ) {
          console.log('mobile micromessenger');
        } else {
          console.log('computer');
        }
      }
    },
    watch: {
      $route: {
        handler: function (val, oldVal) {
          let tab = val.name;
          if (tab === 'Index') {
            this.changeTab(1);
          } else if (tab === 'Prize') {
            this.changeTab(2);
          } else if (tab === 'List') {
            this.changeTab(3);
          } else if (tab === 'Register') {
            this.changeTab(4);
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    computed: {
      activityName: function () {
        return store.state.activity.activityName;
      },
      activityBeginTime: function () {
        return store.state.activity.activityBegintime;
      },
      activityEndTime: function () {
        return store.state.activity.activityEndtime;
      }
    }
  };
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
    bottom: 0px;
    margin: 0px;
    z-index: 1000;
    border-top: 1px solid #e2e2e2;
  }

  .marquee-title {
    height: 30px;
    position: fixed;
    top: 0px;
    margin: 0px;
    width: 100%;
    color: #fff;
    background: rgba(9, 187, 7, 0.65);
    z-index: 1000;
    & > marquee {
      line-height: 30px;
    }
  }
</style>
