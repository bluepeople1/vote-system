<template>
  <div id="container">
    <!-- {{wxcode}} -->
    <div class="marquee-title">
      <marquee>{{activityName}} 活动时间：{{activityBeginTime}} ~ {{activityEndTime}}</marquee>
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
  import { wxlogin, login, getActivityInfo, wxAuth ,getJsapiTicket} from '@/api/Service';
  import { sign } from '@/assets/js/sign';

  let Base64 = require('js-base64').Base64;

  export default {
    data () {
      return {
        wxcode: '',
        selectedTab: 1,
        uuid: '',
        activityInfo: '',
        activityName: sessionStorage.getItem('activityName'),
        activityBeginTime: sessionStorage.getItem('activityBegintime'),
        activityEndTime: sessionStorage.getItem('activityEndtime')
      };
    },
    created: function () {
      //页面刷新后，判断当前页面所在tab
      this.currentTab();

      const uuid = sessionStorage.getItem('uuid');
      //判断uuid是否存在
      // if (uuid) {
      //   //如果uuid不存在，就从url中截取
      //   let url = window.location.href.split("#")[1];
      //   let data = Base64.decode(url.split("/")[2]);
      //   let openId = data.split("#")[0].split("=")[1];
      //   let uuid = data.split("#")[1].split("=")[1];
      //   sessionStorage.setItem("uuid", uuid);
      //   sessionStorage.setItem("openId", openId);
      //   this.uuid = sessionStorage.getItem("uuid");
      // }
      // const sessionId = sessionStorage.getItem("sessionId");
      // if (sessionId) {
      //   //用户登录，获取sessionid
      //   login(res => {
      //     sessionStorage.setItem("sessionId", res.data.sessionid);
      //     this.getDataList();
      //   });
      // } else {
      //   this.getDataList();
      // }
      // this.device();
    },
    mounted: function () {

      const ticket="kgt8ON7yVITDhtdwci0qeVM6-pSBagSBp94OYaUJtdIWsmmo207FXHRgWoskuXmGESpydpqopeMt1csM6SeEuA";

      const config = sign(ticket, 'http://47.100.243.198/vote-system/');
      console.log(location.href.split('#')[0]);
      // 配置功能
      wx.config({
        debug: true,
        appId: "wx3fec79cd177fcfe9",
        timestamp: config.timestamp,
        nonceStr: config.noncestr,
        signature: config.signature,
        jsApiList: [
          'updateAppMessageShareData',
          'chooseWXPay'
        ]
      });
      wx.ready(function () {
        wx.updateAppMessageShareData({
          title: '我们的班级我们的团，快来为班级荣誉而战！', // 分享标题
          desc: '哥们儿，咱多久没一起喝酒吃饭了，多久没促膝长谈了，Hey兄弟们！咱该聚聚了！',
          link: location.href, // 分享链接
          imgUrl: 'https://tup.iheima.com/sport.png', // 分享图标
          success: function () {
            alert('成功');
          },
          cancel: function () {
            alert('失败');
          }
        });
        wx.chooseWXPay({
          timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: '', // 支付签名随机串，不长于 32 位
          package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: '', // 支付签名
          success: function (res) {
// 支付成功后的回调函数
          }
        });
      });
      wx.error(function (res) {
        console.log(res);
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      });
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
          uuid: sessionStorage.getItem('uuid')
        };
        //获取活动信息
        getActivityInfo(params, res => {
          console.log('活动', res);
          that.activityInfo = res.data[0];
          sessionStorage.setItem('activityName', res.data[0].activeName);
          sessionStorage.setItem(
            'activityBeginTime',
            res.data[0].activeBegintime
          );
          sessionStorage.setItem('activityEndTime', res.data[0].activeEndtime);
          that.activityName = sessionStorage.getItem('activityName');
          that.activityBeginTime = sessionStorage.getItem('activityBeginTime');
          that.activityEndTime = sessionStorage.getItem('activityEndTime');
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
          console.log(val);
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
    }
  };
</script>

<style scoped>
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
    position: fixed;
    top: 0px;
    margin: 0px;
    width: 100%;
    color: #fff;
    background: #09bb0759;
    z-index: 1000;
  }
</style>
