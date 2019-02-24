<template>
  <!--详情页-->
  <div id="main">
    <my-header title="详情页"/>
    <!--头部用户信息-->
    <!--<div id="header">-->
      <!--&lt;!&ndash;照片&ndash;&gt;-->
      <!--<div id="userImg">-->
        <!--<swiper-banner :dataList="studentImages" :height="300" />-->
        <!--&lt;!&ndash;<my-img :imageSrc="config.img_url + studentImages[0]" errorType="user" width="100%" height="300px"/>&ndash;&gt;-->
      <!--</div>-->
      <!--&lt;!&ndash;<div @click="toPresentPage">&ndash;&gt;-->
      <!--&lt;!&ndash;<div style="color:#0db52b">&ndash;&gt;-->
      <!--&lt;!&ndash;去给TA加油打气>>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--</div>-->
    <!--内容-->
    <div id="content">
      <!--用户名-->
      <div id="userName">
        {{studentInfo.studentCode + '号选手：' + studentInfo.studentName}}
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
          <!-- <div class="weui-flex__item">
              <div class="placeholder">
                  <div>
                      <img src="../assets/img/white_pv.png" />
                      <span> 礼物点数</span>
                  </div>
                  <div>
                      <span>108</span>
                  </div>
              </div>
          </div> -->
        </div>
      </div>
      <div v-if="isShowImgList">
        <ul>
          <li v-for="(it, i) in studentImages" :key="i">
            <my-img :imageSrc="config.img_url + it" errorType="img" width="100%"/>
          </li>
        </ul>
      </div>
      <none-data class="index-none-data" v-else/>
      <!--礼物赠送列表-->
      <div class="list">
        <div class="menu">
          <img src="../assets/img/menu-list.png"/>
          <span class="menu-name">收到的礼物</span>
        </div>
        <div>
          <ul v-if="giftList.length !== 0">
            <li class="card-item flex" v-for="item in giftList" :key="item.id">
              <div class="fl grid marL10">
                <my-img :imageSrc="item.headImgUrl" errorType="user" width="35" height="35"/>
              </div>
              <div class="fl grid marL10">
                <div style="text-align: left">
                  <span style="color:#26a69a;text-align: left">{{item.nickName}}</span>
                </div>
                <div style="text-align: left">
                  <span
                    style="color: #a22232;font-size: 12px;">赠送了{{item.giftCount||0}}个{{item.giftName||'未知礼物'}}</span>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="card-item flex" style="justify-content: center;align-content: center">
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
            <li class="card-item flex" v-for="item in voteCon" :key="item.id">
              <div class="fl grid marL10">
                <my-img :imageSrc="item.headImgUrl" errorType="user" width="35" height="35"/>
              </div>
              <div class="fl grid marL10">
                <div style="text-align: left">
                  <span style="color:#26a69a;text-align: left">{{item.nickName}}</span>
                </div>
                <div style="text-align: left">
                  <span
                    style="color: #a22232;font-size: 12px;">给你投了{{item.votingCount || 0}}票</span>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="card-item flex" style="justify-content: center;align-content: center">
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
import Header from './common/Header'
import Dialog from './common/Dialog'
import ImageError from './common/ImageError'
import apiService from '../api/Service'
import moment from 'moment'
import CommonService from '../assets/js/common'
import SwiperView from './common/SwiperView'
import NoneData from './common/NoneData'

export default {
  components: {
    'my-dialog': Dialog,
    'my-header': Header,
    'none-data': NoneData,
    'my-img': ImageError,
    'swiper-banner': SwiperView,
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
      loginId: this.$route.params.loginId,
      activityId: this.$route.params.activityId,
      voteCon: [] // 学生所获票数记录
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
        page: 0,
        pageSize: 15
      }
      let ajaxArr = [
        this.getStuBasicInfo(this, data),
        this.getStuImages(this, data),
        this.getStuVoteCon(this, listParams),
        this.getStuGiftList(this, listParams)
      ]
      Promise.all(ajaxArr).then(data => {
        console.log(data)
        // 选手基本信息
        this.studentInfo = data[0].resultObject.studentInfo
        // 选手照片信息
        this.studentImages = data[1].resultObject.studentImaUrl
        // 选手所获投票记录
        this.voteCon = data[2].resultObject.studentVotingInfo
        // 选手所获礼物列表
        this.giftList = data[3].resultObject.studentToGiftInfo
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
    //返回首页
    goBack: function () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/index')
    },
    //跳转去礼物页面
    toPresentPage () {
      this.$router.push({
        name: 'Present',
        params: {loginId: this.loginId, activityId: this.activityId, studentId: this.studentId}
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
        openId: this.config.openId,
        nickName: this.config.nickName,
        headImgUrl: this.config.headImgUrl
      }).then(data => {
        //2001-当天已经跟该选手投票 2002-当天投票机会用完 2003-投票成功
        switch (Number(data.resultObject.code)) {
          case 2001:
            this.showTip(['温馨提示', '您已给该选手投过票了哦~\n去给TA赠送礼物吧~', 'block'])
            break
          case 2002:
            this.showTip(['温馨提示', '您一天只能投三票哦~\n去给TA赠送礼物吧~', 'block'])
            break
          case 2003:
            this.showTip(['投票成功', '感谢您的参与，您已给该选手增加了宝贵一票', 'block'])
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
    #header {
      margin-top: 44px;
      #userImg {
        /*background: url("../assets/img/thum.png") no-repeat;*/
        /*background-size: cover;*/
      }
    }
    #content {
      margin-top: 44px;
      margin-bottom: 44px;
      #userName {
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
