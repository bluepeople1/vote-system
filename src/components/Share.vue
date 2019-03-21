<template>
  <!--详情页-->
  <div id="main">
    <div class="header">
      <div class="backBtn" @click="toIndex">
        <img src="../assets/img/back_arrow.png" width="36"/>
        <span>首页</span>
      </div>
      <span class="til">{{studentInfo.studentCode + '号选手'}}</span>
    </div>
    <!--内容-->
    <div id="content">
      <div v-if="isShowImgList" v-for="(it, i) in studentImages" :key="i" style="margin: 15px;">
        <my-img :imageSrc="it" errorType="img"/>
      </div>
      <none-data class="index-none-data" v-else/>
      <div v-if="videoList.length !== 0">
        <div class="video-title">选手视频</div>
        <div v-for="(it,idx) in videoList" :key="idx" >
          <my-player :videoPath="it" :poster="studentImages[0]"/>
        </div>
      </div>
      <!--用户名-->
      <div id="userName">
        {{studentInfo.studentName}}
      </div>
      <!--用户信息-->
      <div id="counter">
        <div class="weui-flex">
          <div class="weui-flex__item">
            <div class="placeholder">
              <div>
                <img src="../assets/img/white_apply.png"/>
                <span> 当前票数</span>
              </div>
              <div>
                <span>{{studentInfo.studentVoteNumber || 0}}</span>
              </div>
            </div>
          </div>
          <div class="weui-flex__item">
            <div class="placeholder">
              <div>
                <img src="../assets/img/white_vote.png"/>
                <span> 当前排名</span>
              </div>
              <div>
                <span>{{studentInfo.ranking || '暂未上榜'}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--礼物赠送列表-->
      <div class="list">
        <div class="menu">
          <img src="../assets/img/menu-list.png"/>
          <span class="menu-name">收到的礼物</span>
        </div>
        <div>
          <ul v-if="giftList.length !== 0">
            <li class="card-item" v-for="item in giftList" :key="item.id">
              <div class="grid marL10">
                <my-img :imageSrc="item.headImgUrl" errorType="user" width="35" height="35"/>
              </div>
              <div class="item-right">
                <div class="grid marL10" style="flex: 1 1;">
                  <span class="wx-name">{{item.nickName || '暂无'}}</span>
                  <span class="time">{{dataFormat(item.addTime.time)}}</span>
                </div>
                <div class="marR10" style="display: flex;align-items: center">
                  <div class="marR10 time">赠送了</div>
                  <my-img class="marR10"
                          :imageSrc="item.giftImaUrl"
                          errorType="user"
                          width="25"
                          height="25"/>
                  <div class="grid" style="width: 40px;">
                    <div class="gift-name">
                      <span>{{item.giftName || '未知礼物'}}</span>
                    </div>
                    <span class="gift-num">X {{item.giftCount || 0}}</span>
                  </div>
                </div>
              </div>
            </li>
            <li class="loadMore" @click="loadMore(0)" v-if="isLoadMoreGift">点击加载更多</li>
          </ul>
          <div v-else class="card-item" style="justify-content: center;align-content: center">
            <div style="color: #ec8b89;line-height: 56px;">暂时还未收到礼物</div>
          </div>
        </div>
      </div>
      <div class="list">
        <div class="menu">
          <img src="../assets/img/menu-list.png"/>
          <span class="menu-name">收到的票数</span>
        </div>
        <div>
          <ul v-if="voteCon.length !== 0">
            <li class="card-item" v-for="item in voteCon" :key="item.id">
              <div class="grid marL10">
                <my-img :imageSrc="item.headImgUrl" errorType="user" width="35" height="35"/>
              </div>
              <div class="item-right">
                <div class="grid marL10">
                  <span style="color:#26a69a;text-align: left">{{item.nickName || '暂无'}}</span>
                  <span style="color: #a22232;font-size: 12px;">{{dataFormat(item.addTime.time)}}</span>
                </div>
                <div class="grid marR10">
                  <div style="text-align: left">
                    <span style="color:#26a69a">票数</span>
                  </div>
                  <span style="color: #a22232;font-size: 12px;">X {{item.votingCount || 0}}票</span>
                </div>
              </div>
            </li>
            <li class="loadMore" @click="loadMore(1)" v-if="isLoadMoreVoteCon">点击加载更多</li>
          </ul>
          <div v-else class="card-item" style="justify-content: center;align-content: center">
            <div style="color: #ec8b89;line-height: 56px;">暂时还没有人投票</div>
          </div>
        </div>
      </div>
    </div>
    <!--底部-->
    <div id="footer">
      <div class="weui-flex">
        <div class="weui-flex__item" @click="vote">
          <div class="placeholder" style="margin:0 15px;"><a class="weui-btn weui-btn_default flex-grow">投票</a></div>
        </div>
        <div class="weui-flex__item" @click="toPresentPage">
          <div class="placeholder" style="margin:0 15px;"><a class="weui-btn weui-btn_primary flex-grow">送礼物</a></div>
        </div>
      </div>
    </div>
    <my-dialog :title="title" :content="content" :display="dialog" v-on:dialogListener="dialogListener"/>
  </div>
</template>

<script>
// import * as _ from 'lodash'
import VideoPlayer from './common/VideoPlayer'
import Header from './common/Header'
import Dialog from './common/Dialog'
import ImageError from './common/ImageError'
import apiService from '../api/Service'
import moment from 'moment'
import CommonService from '../assets/js/common'
import SwiperView from './common/SwiperView'
import NoneData from './common/NoneData'
import {signs} from '@/assets/js/sign'
import wx from 'weixin-js-sdk'

export default {
  components: {
    'my-dialog': Dialog,
    'my-header': Header,
    'none-data': NoneData,
    'my-img': ImageError,
    'swiper-banner': SwiperView,
    'my-player': VideoPlayer
  },
  data () {
    return {
      rank: 1,
      dialog: 'none',
      studentInfo: {}, // 学生基本信息
      studentImages: [], // 学生照片
      title: '',
      content: '',
      giftList: [], // 学生收到的礼物
      studentId: this.$route.params.studentId,
      activityId: this.$route.params.activityId,
      loginId: this.$route.params.loginId,
      openId: this.$route.params.openId,
      nickName: this.$route.params.nickName,
      headImgUrl: this.$route.params.headImgUrl,
      studentCode: this.$route.params.studentCode,
      voteCon: [], // 学生所获票数记录
      videoList: [],
      giftPage: 1,
      votePage: 1,
      voteTotalCount: 0,
      giftTotalCount: 0,
      pageSize: 15,
      sharedUrl: ''
    }
  },
  created () {
    this.getStuInfo()
  },
  mounted: function () {
    window.addEventListener('popstate', function (e) {  //popstate监听返回按钮
      this.goBack()
    }, false)
  },
  methods: {
    loadMore (type) {
      let params = {
        loginId: this.loginId,
        activityId: this.activityId,
        studentId: this.studentId,
        pageSize: this.pageSize
      }
      if (type) {
        params.page = (++this.votePage)
        Promise.resolve(this.getStuVoteCon(this, params)).then(data => {
          this.voteCon = [...this.voteCon, ...data.resultObject.studentVotingInfo]
        })
      } else {
        params.page = (++this.giftPage)
        Promise.resolve(this.getStuGiftList(this, params)).then(data => {
          this.giftList = [...this.giftList, ...data.resultObject.studentToGiftInfo]
        })
      }
    },
    dataFormat (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    /**
     * 获取学生信息
     */
    getStuInfo () {
      let data = {
        loginId: this.loginId,
        activityId: this.activityId,
        studentId: this.studentId
      }
      let listParams = {
        loginId: this.loginId,
        activityId: this.activityId,
        studentId: this.studentId,
        page: 1,
        pageSize: this.pageSize
      }
      let ajaxArr = [
        this.getStuBasicInfo(this, data),
        this.getStuImages(this, data),
        this.getStuVideos(this, data),
        this.getStuVoteCon(this, listParams),
        this.getStuGiftList(this, listParams)
      ]
      Promise.all(ajaxArr).then(data => {
        // 选手基本信息
        this.studentInfo = data[0].resultObject.studentInfo
        // 选手照片信息
        this.studentImages = data[1].resultObject.studentImaUrl
        // 视频
        this.videoList = data[2].resultObject.videoPath
        // 选手所获投票记录
        this.voteCon = data[3].resultObject.studentVotingInfo
        this.voteTotalCount = data[3].resultObject.studentVotingInfoCount
        // 选手所获礼物列表
        this.giftList = data[4].resultObject.studentToGiftInfo
        this.giftTotalCount = data[3].resultObject.studentToGiftInfoCount

        this.sharedUrl = this.config.prefix + 'homeschool/wxInterface/wxToGrantAuthorizationToStudent?aid=' + this.activityId + '&bid=' + this.loginId +'&studentId=' + this.studentId
        let map = new Map()
        map.set('nickName', this.nickName || '')
        map.set('headImgUrl', this.headImgUrl || '')
        map.set('openId', this.openId)
        map.set('loginId', this.loginId)
        map.set('activityId', this.activityId)
        map.set('studentCode', Number(this.studentCode))
        this.$store.dispatch('config', map)
        let params = {
          loginId: this.loginId, // 登录用户Id
          activityId: this.activityId // 当前所在活动Id
        }
        let ajaxArr = [
          this.getMusic(this, params),
          this.getCurrentActivityInfo(this, params),
          this.getJsTicketAndToken(this, params)
        ]
        Promise.all(ajaxArr).then(data => {
          document.title = data[1].resultObject.ActivityInfo.activityName
          let m = new Map()
          m.set('activityInfo', data[1].resultObject)
          m.set('musicUrl', data[0].resultObject.musicPath)
          this.$store.dispatch('config', m)
          this.setWxShareConfig(data[2].resultObject, data[1].resultObject.ActivityInfo)
        }, error => {
          console.log(error)
        })
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
          'onMenuShareAppMessage'
        ]
      })
      let shareConfig = {
        title: '我是' + this.studentInfo.studentName + '，快来支持我吧！', // 分享标题
        desc: '我是' + this.studentInfo.studentName + '，现在正在参加' + activityInfo.activityName || '我们正在做活动，快点进来看看吧！',
        link: this.sharedUrl, // 分享链接
        imgUrl: this.studentImages[0] || '', // 分享图标
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
      })
    },
    /**
     * 获取学生
     */
    getStuVoteCon (that, params) {
      return new Promise((resolve, reject) => {
        apiService.getStuDetailVoteRecord(that, params).then(success => {
          resolve(success)
        }, err => {
          reject(err)
        })
      })
    },
    /**
     * 获取学生收到的礼物列表
     */
    getStuGiftList (that, params) {
      return new Promise((resolve, reject) => {
        apiService.getStuGiftDetail(that, params).then(success => {
          resolve(success)
        }, err => {
          reject(err)
        })
      })
    },
    /**
     * 获取学生照片
     */
    getStuImages (that, params) {
      return new Promise((resolve, reject) => {
        apiService.getStuDetailImg(that, params).then(success => {
          resolve(success)
        }, err => {
          reject(err)
        })
      })
    },
    /**
     * 获取学生基本信息
     */
    getStuBasicInfo (that, params) {
      return new Promise((resolve, reject) => {
        apiService.getStuDetailInfo(that, params).then(success => {
          resolve(success)
        }, err => {
          reject(err)
        })
      })
    },
    /**
     * 获取学生视频
     */
    getStuVideos (that, params) {
      return new Promise((resolve, reject) => {
        apiService.getActivityVideo(that, params).then(success => {
          resolve(success)
        }, err => {
          reject(err)
        })
      })
    },
    //返回首页
    toIndex: function () {
      this.$router.push({
        name: 'Index',
        params: {
          loginId: this.loginId,
          activityId: this.activityId,
          openId: this.openId,
          nickName: this.nickName,
          headImgUrl: this.headImgUrl
        }
      })
    },
    //跳转去礼物页面
    toPresentPage () {
      this.$router.push({
        name: 'Present',
        params: {
          loginId: this.loginId,
          activityId: this.activityId,
          studentId: this.studentId
        }
      })
    },
    /**
     * 信息提示
     */
    showTip (msg) {
      [this.title, this.content, this.dialog] = msg
    },
    /**
     * 调用投票接口
     */
    vote () {
      //如果当前活动还未开始，不让投票
      if (CommonService.isActivityNotBegin(this.nowTime, this.beginTime)) {
        this.showTip(['温馨提示', '活动还未开始呢~', 'block'])
        return
      }
      //如果活动已经结束了，不让投票
      if (CommonService.isActivityEnd(this.nowTime, this.endTime)) {
        this.showTip(['温馨提示', '活动已经结束啦~', 'block'])
        return
      }
      apiService.vote(this, {
        loginId: this.loginId,
        activityId: this.activityId,
        studentId: this.studentId,
        openId: this.openId,
        nickName: this.nickName,
        headImgUrl: this.headImgUrl
      }).then(data => {
        //2001-当天已经跟该选手投票 2002-当天投票机会用完 2003-投票成功
        switch (Number(data.resultNumber)) {
          case 2001:
            this.showTip(['温馨提示', '您已给该选手投过票了哦~\n去给TA赠送礼物吧~', 'block'])
            break
          case 2002:
            this.showTip(['温馨提示', '您一天只能投三票哦~\n去给TA赠送礼物吧~', 'block'])
            break
          case 0:
            this.showTip(['投票成功', '感谢您的参与，您已给该选手增加了宝贵一票', 'block'])
            this.getStuInfo()
            break
        }
      })
    },
    //dialog 事件监听器
    dialogListener (data) {
      this.dialog = data.hide
    }
  },
  computed: {
    isLoadMoreVoteCon () {
      if (this.voteCon.length === 0) {
        return false
      }
      return this.page < Math.ceil(this.voteTotalCount / this.pageSize)
    },
    isLoadMoreGift () {
      if (this.giftList.length === 0) {
        return false
      }
      return this.page < Math.ceil(this.giftTotalCount / this.pageSize)
    },
    /**
     * 是否展示图片列表
     */
    isShowImgList () {
      return this.studentImages.length !== 0
    },
    /**
     * 活动开始时间
     * @returns {*|moment.Moment}
     */
    beginTime () {
      if (this.activityInfo.detail) {
        let time = this.activityInfo.detail.activityStartTime
        if (time) {
          return moment(time.replace(/-/g, '/')).valueOf()
        }
      }
    },
    /**
     * 活动结束时间
     * @returns {*}
     */
    endTime () {
      if (this.activityInfo.detail) {
        let time = this.activityInfo.detail.activityEndTime
        if (time) {
          return moment(time.replace(/-/g, '/')).valueOf()
        }
      }
    },
    /**
     * 当前时间
     * @returns {number}
     */
    nowTime () {
      return moment().valueOf()
    },
    config () {
      return this.$store.getters.config
    },
    /**
     * 当前活动信息
     * @returns {{detail: *, loginId: (string), activityId: (string), count: (*|number), pv: (*|number), voteNum: (*|number)}}
     */
    activityInfo () {
      let activityInfo = this.config.activityInfo
      let flag = Object.keys(activityInfo).length !== 0
      return {
        detail: flag ? activityInfo.ActivityInfo : null,
        loginId: this.config.loginId,
        activityId: this.config.activityId,
        count: flag ? activityInfo.studentCount : 0, //报名人数
        pv: flag ? activityInfo.ActivityBrowseVolume : 0, //访问量
        voteNum: flag ? activityInfo.studentTicketCount : 0 //投票总数
      }
    }
  },
  beforeDestroy () {
    // this.$jquery(window).off('popstate');
    window.removeEventListener('popstate', function () {

    }, false)
  }
}
</script>

<style scoped lang="less">
  #main {
    background: #ecf0f5;
    /*min-height: calc(100% - 44px);*/
    min-height: 100%;
    .header {
      width: 100%;
      height: 44px;
      line-height: 44px;
      color: #fff;
      background: #3cb371;
      position: fixed;
      top: 0;
      .backBtn {
        position: absolute;
        left: 15px;
        img {
          width: 8px;
          margin-right: 5px;
        }
      }
      .til {
        font-size: 16px;
      }
    }
    #content {
      margin-top: 44px;
      margin-bottom: 44px;
      .video-title {
        margin-top: 8px;
        background: #3cb371;
        color: #fff;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
      }
      #userName {
        margin-top: 20px;
        background: #fff;
        height: 35px;
        line-height: 35px;
        color: #2e8b57;
      }
      #counter {
        background: #3cb371;
        height: 50px;
        color: #fff;
        .weui-flex {
          .weui-flex__item {
            .placeholder {
              div {
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                  padding-left: 5px;
                }
              }
            }
          }
        }

      }
      .list {
        background: #3cb371;
        margin: 20px 15px 25px;
        .menu {
          display: flex;
          height: 35px;
          align-items: center;
          margin-left: 10px;
          .menu-name {
            padding-left: 10px;
            color: #fff;
            font-size: 14px;
          }
        }
        .card-item {
          background: #fff;
          width: 100%;
          height: 55px;
          display: flex;
          .item-right {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .wx-name {
              color: rgb(38, 166, 154);
              text-align: left;
              font-size: 14px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .time {
              color: #a22232;
              font-size: 12px;
              text-align: left;
            }
            .gift-num {
              color: #a22232;
              font-size: 12px;
            }
            .gift-name {
              color: rgb(38, 166, 154);
              font-size: 12px;
            }
          }
        }
        .loadMore {
          background: #e4e4e4;
          font-size: 14px;
          height: 35px;
          line-height: 35px;
        }
      }
    }
    .bottom {
      width: 100%;
      position: fixed;
      bottom: 15px;
    }
    #footer {
      width: 100%;
      background: #f7f7fa;
      height: 44px;
      color: #fff;
      position: fixed;
      bottom: 0;
      z-index: 1000;
      /*投票按钮*/
      .vote {
        position: absolute;
        z-index: 100001;
        left: 45%;
        top: -24px;
        width: 55px;
        height: 55px;
        line-height: 55px;
        border-radius: 30px;
        color: #fff;
        font-size: 14px;
        background: #236d67;
        -webkit-box-shadow: 1px 2px 5px #073129;
        box-shadow: 1px 2px 5px #073129;
      }

      /*按钮点击效果*/
      .vote:active {
        position: absolute;
        z-index: 100001;
        left: 45%;
        top: -22px;
        width: 55px;
        height: 55px;
        line-height: 55px;
        border-radius: 30px;
        color: #fff;
        font-size: 12px;
        background: #236d67;
        -webkit-box-shadow: 1px 2px 5px #073129;
        box-shadow: 1px 2px 5px #073129;
      }

      .weui-btn {
        font-size: 14px !important;
      }
    }
    .flex {
      display: flex;
      border-bottom: 1px solid #ececec;
    }
    .grid {
      align-content: center;
      display: grid;
    }

    .fl {
      float: left;
    }

    .fr {
      float: right;
    }

    .marL10 {
      margin-left: 10px;
    }

    .marR10 {
      margin-right: 10px;
    }

    .flex-grow {
      flex-grow: 1;
    }

    ul {
      width: 100%;
      list-style: none;
    }
  }

</style>
