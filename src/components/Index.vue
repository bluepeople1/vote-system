<template>
  <div id="main">
    <!--头部banner信息-->
    <div id="banner">
      <!--海报图-->
      <div id="image">
        <swiper-banner :dataList="banner" :height="170"/>
      </div>
      <!--已报名、累计投票、访问量-->
      <div id="counter">
        <div class="weui-flex">
          <div class="weui-flex__item">
            <div class="placeholder">
              <div>
                <img src="../assets/img/white_apply.png"/>
                <span> 报名人数</span>
              </div>
              <div>
                <span>{{activityInfo.count}}</span>
              </div>
            </div>
          </div>
          <div class="weui-flex__item">
            <div class="placeholder">
              <div>
                <img src="../assets/img/white_vote.png"/>
                <span> 累计投票</span>
              </div>
              <div>
                <span>{{activityInfo.voteNum}}</span>
              </div>
            </div>
          </div>
          <div class="weui-flex__item">
            <div class="placeholder">
              <div>
                <img src="../assets/img/white_pv.png"/>
                <span> 访问量</span>
              </div>
              <div>
                <span>{{activityInfo.pv}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--倒计时-->
      <div id="countDown">
        <span>{{timeCountTitle}}</span>
        <ul>
          <li class="li-item-time">
            <span><span>{{days}} </span>天</span>
          </li>
          <li class="li-item-time">
            <span><span>{{hours}}</span> 小时</span>
          </li>
          <li class="li-item-time">
            <span><span>{{minutes}}</span> 分</span>
          </li>
          <li class="li-item-time">
            <span><span>{{seconds}}</span> 秒</span>
          </li>
        </ul>
        {{time}}
      </div>
    </div>
    <!--内容-->
    <div id="content">
      <!--搜索框-->
      <div id="search">
        <input type="text" v-model="keywords" placeholder="请输入选手信息"/>
        <!-- <button>搜  索</button> -->
        <div @click="search">
          <a class="weui-btn weui-btn_primary flex-grow">搜 索</a>
        </div>
      </div>
      <!--列表-->
      <div id="list" v-if="isShowStudentList">
        <div class="item" v-for="(item, index) in dataList" :key="index">
          <div @click="toDetailPage(item.id)">
            <div class="item-header">
              <span class="sort">{{item.studentCode}} 号选手</span>
              <span class="ticket">{{item.studentVoteNumber}}票</span>
            </div>
            <my-img :imageSrc="item.studentHeadIma" errorType="user" width="100%" height="170"/>
          </div>
          <div class="item-bottom">
            <span>{{item.studentName}} </span>
            <!--<span class="vote" @click="vote(item.id)">投票</span>-->
          </div>
        </div>
      </div>
      <none-data class="index-none-data" v-else/>

      <div class="marTop15" v-show="isLoadMore">
        <div class="weui-flex">
          <div class="weui-flex__item" @click="loadMoreStudent">
            <div class="placeholder" style="margin:0 15px;">
              <a class="weui-btn weui-btn_default flex-grow">查看更多</a>
            </div>
          </div>
        </div>
      </div>

      <div class="marTop30">
        <div class="weui-flex">
          <div class="weui-flex__item">
            <hr class="line">
          </div>
          <div class="weui-flex__item">
            <div class="placeholder">活动详情</div>
          </div>
          <div class="weui-flex__item">
            <hr class="line">
          </div>
        </div>
      </div>
      <div class="marTop30" v-if="isShowImgList">
        <ul>
          <li v-for="(it,idx) in imgList" :key="idx">
            <my-img :imageSrc="it" errorType="img" width="100%"/>
          </li>
        </ul>
      </div>
      <none-data class="index-none-data" v-else/>
      <div class="marTop30">
        <div class="weui-flex">
          <div class="weui-flex__item">
            <hr class="line">
          </div>
          <div class="weui-flex__item">
            <div class="placeholder">活动视频</div>
          </div>
          <div class="weui-flex__item">
            <hr class="line">
          </div>
        </div>
      </div>
      <div class="marTop30" v-for="(it,idx) in videoList" :key="idx" v-if="videoList.length !== 0">
        <my-player :videoPath="it" :poster="banner[0]" />
      </div>
    </div>
    <my-dialog :title="title" :toGiftPage="isToGiftPage" :content="content" :display="dialog"
               v-on:dialogListener="dialogListener"/>
  </div>
</template>

<script>
import apiService from '@/api/Service'
import Dialog from './common/Dialog'
import ImageError from './common/ImageError'
import NoneData from './common/NoneData'
import SwiperView from './common/SwiperView'
import WaterFall from 'vue-waterfall-easy'
import moment from 'moment'
import store from '../assets/js/common'
import VideoPlayer from './common/VideoPlayer'

export default {
  components: {
    'my-dialog': Dialog,
    'my-img': ImageError,
    'none-data': NoneData,
    'img-waterfall': WaterFall,
    'swiper-banner': SwiperView,
    'my-player': VideoPlayer
  },
  data () {
    return {
      timeCountTitle: '活动倒计时',
      isToGiftPage: false,
      time: '',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      imgList: [],
      banner: [],
      dataList: [], //学生列表
      title: '', //dialog title 信息
      content: '', //dialog 显示提示内容
      keywords: '', //搜索关键字
      dialog: 'none',
      isShowAllStudent: false,//是否显示加载全部
      page: 1, //当前页码
      pageSize: 15,
      videoList: []
    }
  },
  created: function () {
    let data = {
      loginId: this.activityInfo.loginId, // 登录用户Id
      activityId: this.activityInfo.activityId // 当前所在活动Id
    }
    let ajaxArr = [
      // this.getCurrentActivityInfo(this, data),
      this.getCurrentActivitySlideshowImg(this, data),
      this.getCurrentActivityPropaganda(this, data),
      this.getCurrentActivityStuList(this, {
        loginId: this.activityInfo.loginId, // 登录用户Id
        activityId: this.activityInfo.activityId, // 当前所在活动Id
        page: this.page,
        pageSize: 15,
        studentName: ''
      }),
      this.getStuVideos(this, data)
    ]
    Promise.all(ajaxArr).then(data => {
      this.timeDiff() // 倒计时
      this.banner = data[0].resultObject.headImgUrl
      this.imgList = data[1].resultObject.contentImgUrl
      this.dataList = data[2].resultObject.studentInfo
      this.videoList = data[3].resultObject.videoPath
    }, error => {
      console.log(error)
    })
  },
  methods: {
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
     * 获取当前活动首页轮播图片
     * @param that
     * @param params
     * @response resultNumber 0:成功 非0:失败
     * @response resultMsg 结果消息
     * @response resultObject.headImgUrl 首页轮播图路径
     */
    getCurrentActivitySlideshowImg (that, params) {
      return new Promise(function (resolve, reject) {
        apiService.getActivitySlideshow(that, params).then(success => {
          return resolve(success)
        }, err => {
          return reject(err)
        })
      })
    },
    /**
     * 获取当前活动首页宣传图
     * @param that
     * @param params
     * @response resultNumber 0:成功 非0:失败
     * @response resultMsg 结果消息
     * @response resultObject.contentImgUrl 图片路径
     */
    getCurrentActivityPropaganda (that, params) {
      return new Promise(function (resolve, reject) {
        apiService.getActivityContentImg(that, params).then(success => {
          return resolve(success)
        }, err => {
          return reject(err)
        })
      })
    },
    /**
     * 查询当前活动学生
     * @params {
     *     loginId:用户id
     *     activityId:活动id
     *     page:当前页码
     *     pageSize:显示个数
     *     studentName:搜索文本内容-模糊查询使用
     * }
     */
    getCurrentActivityStuList (that, params) {
      return new Promise(function (resolve, reject) {
        apiService.getActivityStudents(that, params).then(success => {
          return resolve(success)
        }, err => {
          return reject(err)
        })
      })
    },
    //倒计时
    timeDiff () {
      let timeCount = setInterval(() => {
        let timeDiff = ''
        if (store.isActivityNotBegin(this.nowTime, this.beginTime)) {
          //活动还未开始
          this.timeCountTitle = '距活动开始倒计时'
          timeDiff = this.beginTime - this.nowTime
        } else {
          if (!store.isActivityEnd(this.nowTime, this.endTime)) {
            //活动开始且未结束
            this.timeCountTitle = '距活动结束倒计时'
            timeDiff = this.endTime - this.nowTime
          } else {
            if (!timeDiff) {
              clearInterval(timeCount);
              [this.days, this.hours, this.minutes, this.seconds] = [0, 0, 0, 0];
              [this.title, this.content, this.dialog] = ['提示', '当前活动已结束', 'block']
              return
            }
          }
        }

        //计算出相差天数
        let days = Math.floor(timeDiff / (24 * 3600 * 1000))
        //计算出小时数
        let temp1 = timeDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
        let hours = Math.floor(temp1 / (3600 * 1000))
        //计算相差分钟数
        let temp2 = temp1 % (3600 * 1000) //计算小时数后剩余的毫秒数
        let minutes = Math.floor(temp2 / (60 * 1000))
        //计算相差秒数
        let temp3 = temp2 % (60 * 1000) //计算分钟数后剩余的毫秒数
        let seconds = Math.round(temp3 / 1000)
        this.days = days
        this.hours = hours
        this.minutes = minutes
        this.seconds = seconds
      }, 1000)
    },
    /**
     * 调用投票接口
     */
    vote (studentId) {
      //如果当前活动还未开始，不让投票
      if (store.isActivityNotBegin(this.nowTime, this.beginTime)) {
        [this.title, this.content, this.dialog] = ['温馨提示', '活动还未开始呢~', 'block']
        return
      }
      //如果活动已经结束了，不让投票
      if (store.isActivityEnd(this.nowTime, this.endTime)) {
        [this.title, this.content, this.dialog] = ['温馨提示', '活动已经结束啦~', 'block']
        return
      }
      apiService.vote(this, {
        loginId: this.activityInfo.loginId,
        activityId: this.activityInfo.activityId,
        studentId: studentId,
        openId: this.config.openId,
        nickName: this.config.nickName,
        headImgUrl: this.config.headImgUrl
      }).then(data => {
        //2001-当天已经跟该选手投票 2002-当天投票机会用完 2003-投票成功
        switch (Number(data.resultNumber)) {
          case 2001:
            this.title = '温馨提示'
            this.content = '您已给该选手投过票了哦~\n去给TA赠送礼物吧~'
            break
          case 2002:
            this.title = '温馨提示'
            this.content = '您一天只能投三票哦~\n去给TA赠送礼物吧~'
            break
          case 2003:
            this.title = '投票成功'
            this.content = '感谢您的参与，您已给该选手增加了宝贵一票'
            break
        }
        this.dialog = 'block' //显示dialog
      })
    },
    /**
     * 搜索框
     */
    search () {
      this.getStudentList(res => {
        if (res.studentInfo && res.studentInfo.length) {
          this.dataList = res.studentInfo
        } else {
          this.getStudentList(res => {
            this.dataList = res.studentInfo
          })
          this.title = '提示'
          this.content = '没有找到该选手'
          this.dialog = 'block' //显示dialog
        }
      }, true)
    },
    //加载更多学生
    loadMoreStudent () {
      this.page += 1
      this.getStudentList(res => {
        console.log(res)
        this.dataList = this.dataList.concat(res.studentInfo)
      })
    },
    /**
     * 查询学生
     */
    getStudentList (callback, isSearch = false) {
      Promise.all([this.getCurrentActivityStuList(this, {
        loginId: this.activityInfo.loginId,
        activityId: this.activityInfo.activityId,
        page: this.page,
        pageSize: 15,
        studentName: isSearch ? this.keywords : ''
      })]).then(data => {
        callback(data[0].resultObject)
      })
    },
    //跳转到详情页面
    toDetailPage: function (studentId) {
      //如果当前活动还未开始，不让投票
      if (store.isActivityNotBegin(this.nowTime, this.beginTime)) {
        [this.title, this.content, this.dialog] = ['温馨提示', '活动还未开始呢~', 'block']
        return
      }
      //如果活动已经结束了，不让投票
      if (store.isActivityEnd(this.nowTime, this.endTime)) {
        [this.title, this.content, this.dialog] = ['温馨提示', '活动已经结束啦~', 'block']
        return
      }
      this.$router.push({
        name: 'Detail',
        params: {loginId: this.activityInfo.loginId, activityId: this.activityInfo.activityId, studentId: studentId}
      })
    },
    /**
     * 获取活动视频
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
    //dialog 的监听方法
    dialogListener: function (data) {
      this.dialog = data.hide
    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.getStudentList(res => {
          this.dataList = res.studentInfo
        })
      },
      // 深度观察监听
      deep: true
    }
  },
  computed: {
    /**
     * 是否显示加载更多按钮
     */
    isLoadMore () {
      if (this.dataList.length === 0) {
        return false
      }
      return this.page < Math.ceil(this.activityInfo.count / this.pageSize)
    },
    /**
     * 是否展示学生列表
     */
    isShowStudentList () {
      return this.dataList.length !== 0
    },
    /**
     * 是否展示图片列表
     */
    isShowImgList () {
      return this.imgList.length !== 0
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
    /**
     * 当前配置信息
     */
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
  }
}
</script>

<style scoped lang="less">
  #main {
    width: 100%;
    background: #ecf0f5;
    height: auto;
    margin-bottom: 55px;
    #banner {
      width: 100%;
      #image {
        width: 100%;
        height: 220px;
      }
      /*计数器*/
      #counter {
        margin-left: 15px;
        margin-right: 15px;
        background: #3cb371;
        height: 55px;
        color: #fff;
        .weui-flex {
          font-size: 14px;
          padding: 5px;
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
      /*倒计时*/
      #countDown {
        margin-left: 15px;
        margin-right: 15px;
        background: #fff;
        height: 80px;
        padding-top: 10px;

        & > span {
          color: #e46112;
        }
        /*倒计时*/
        .li-item-time {
          width: 20%;
          height: 30px;
          margin-top: 10px;
          background: #ffffff;
          border: 1px solid #ececec;
          border-radius: 3px;
          display: flex;
          display: -webkit-inline-flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 1px 3px 14px #dcdcdc;
          & > span > span {
            color: red
          }
        }
      }
    }
    #content {
      /*搜索*/
      #search {
        width: 100%;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
      }
      /*搜索框*/
      #search input {
        width: 70%;
        height: 21px;
        background: #ffffff;
        border: 1px solid #ececec;
        border-radius: 3px;
        padding: 5px;
        box-sizing: unset;
      }
      #list {
        display: flex;
        align-items: safe;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-left: 15px;
        margin-right: 15px;
        .item {
          position: relative;
          transition: all 2s cubic-bezier(.17, .67, .83, .67);
          width: 45%;
          border-radius: 5px;
          margin-top: 15px;
          overflow: hidden;
          color: #2e8b57;
          font-size: 14px;
          background: #fff;
          .item-header {
            display: flex;
            justify-content: space-between;
            height: 30px;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding-left: 2px;
            padding-right: 4px;
            .sort {
              color: #007900;
              padding: 5px;
              font-size: 12px;
              left: 5px;
            }
            .ticket {
              color: #ff5b1b;
              font-size: 14px;
            }
          }
          .item-bottom {
            position: relative;
            width: 100%;
            background: #ffffff;
            height: 35px;
            line-height: 35px;
            /*投票按钮*/
            .vote {
              position: absolute;
              top: -25px;
              right: 10px;
              z-index: 12;
              width: 35px;
              height: 35px;
              line-height: 35px;
              border-radius: 20px;
              color: #fff;
              font-size: 10px;
              background: #2e8b57;
              -webkit-box-shadow: 1px 2px 5px #888888;
              box-shadow: 1px 1px 4px #888888;
            }

            /*按钮点击效果*/
            .vote:active {
              position: absolute;
              top: -23px;
              right: 9px;
              z-index: 12;
              width: 35px;
              height: 35px;
              line-height: 35px;
              border-radius: 20px;
              color: #fff;
              font-size: 10px;
              background: #2e8b57;
              -webkit-box-shadow: 1px 2px 5px #888888;
              box-shadow: 1px 1px 4px #888888;
            }
          }
        }
      }
    }
    .weui-btn {
      font-size: 14px !important;
      margin-left: 5px;
    }
    .marTop15 {
      margin-top: 15px;
    }

    .marTop30 {
      margin-top: 30px;
    }
    ul {
      width: 100%;
      list-style: none;
    }

    .line {
      margin: 13px 0;
    }
  }
</style>
