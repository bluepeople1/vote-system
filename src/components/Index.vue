<template>
  <div id="main">
    <!--头部banner信息-->
    <div id="banner">
      <!--海报图-->
      <div id="image">
        <my-img :imageSrc="path+banner" errorType="img" class="banner-img" width="100%" height="170px"/>
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
                <span>{{count||0}}</span>
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
                <span>{{voteNum||0}}</span>
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
                <span>{{pv||0}}</span>
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
      <div id="list" v-if="studentData===true">
        <div class="item" v-for="(item,index) in dataList" :key="index">
          <div @click="toDetailPage(item)">
            <div class="item-header">
              <span class="sort">{{item.studentNumb}}</span>
              <span class="ticket">{{item.studentTicket}}票</span>
            </div>

            <!--<img class="item-pic" v-lazy="path+item.studentImg" width="100%" height="170" />-->
            <my-img :imageSrc="path+item.studentImg" errorType="user" width="100%" height="170"/>
          </div>
          <div class="item-bottom">
            <span>{{item.studentName}} </span>
            <span class="vote" @click="vote(item.studentId)">投票</span>
          </div>
        </div>
      </div>
      <none-data class="index-none-data" v-else/>

      <div class="marTop15" v-show="isLoadMore===true">
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
            <div class="placeholder">活动详情
            </div>
          </div>
          <div class="weui-flex__item">
            <hr class="line">
          </div>
        </div>
      </div>
      <div class="marTop30" v-if="imageData===true">
        <ul>
          <li v-for="(it,idx) in imgList" :key="idx">
            <!--<img v-if="idx!==0" :src="path+it.imgSource" width="100%">-->
            <my-img v-if="idx!==0" :imageSrc="path+it.imgSource" errorType="img" width="100%"/>
          </li>
        </ul>
      </div>
      <none-data class="index-none-data" v-else/>
    </div>
    <my-dialog :title="title" :toGiftPage="isToGiftPage" :content="content" :display="dialog"
               v-on:dialogListener="dialogListener"/>
  </div>
</template>

<script>
  import {
    newLogin,
    vote,
    pv,
    login,
    getStuAndAct,
    search,
    getActivityImg,
    getJsapiTicket,
    searchByFuzzy
  } from '@/api/Service'
  import Dialog from './common/Dialog'
  import ImageError from './common/ImageError'
  import NoneData from './common/NoneData'
  import WaterFall from 'vue-waterfall-easy'
  import moment from 'moment'

  export default {
    components: {
      'my-dialog': Dialog,
      'my-img': ImageError,
      'none-data': NoneData,
      'img-waterfall': WaterFall
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
        banner: '',
        count: 0, //报名人数
        dataList: [], //学生列表
        activityInfo: {}, //活动信息
        pv: 0, //访问量
        voteNum: 0, //投票总数
        title: '', //dialog title 信息
        content: '', //dialog 显示提示内容
        keywords: '', //搜索关键字
        dialog: 'none',
        path: config.img_url,
        studentData: false,
        isLoadMore: true,//是否显示加载更多
        isShowAllStudent: false,//是否显示加载全部
        imageData: false,
        page: 1//当前页码
      }
    },
    created: function () {
      console.log('index created', this.config)
      login(res => {
        this.$store.dispatch('config', new Map().set('_sessionId', res.data.sessionid))
        this.getDataList()
      })
    },
    // 监听,当路由发生变化的时候执行
    watch: {
      $route: {
        handler: function (val, oldVal) {
          this.getDataList()
        },
        // 深度观察监听
        deep: true
      }
    },
    methods: {
      //跳转到详情页面
      toDetailPage: function (userInfo) {
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
          path: '/detail',
          query: {stuName: userInfo.studentName, stuId: userInfo.studentId}
        })
      },
      //搜索
      search: function () {
        let that = this
        let params = {
          key: this.keywords,
          uuid: this.config._uuid
        }
        this.$http.post('https://www.hzrtpxt.top/master/Interface/getStudentByMh?studentName=' + this.keywords + '&activeUuid=' + this.config._uuid, params)
          .then(res => {
            let data = res.resultMap
            if (data && data.length !== 0) {
              that.dataList = data
              that.isLoadMore = false
            } else {
              that.isLoadMore = true
              this.getDataList()
              // this.imageData = true;
              this.title = '提示'
              this.content = '没有找到该选手'
              this.dialog = 'block' //显示dialog
            }
          })

      },
      //投票方法
      vote: function (studentId) {
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

        //接口请求参数
        let params = {
          openId: this.config._openId,
          studentid: studentId
        }

        //调用投票接口
        vote(params, res => {
          if (res.code === 7) {
            this.title = '温馨提示'
            this.content = '您已给该选手投过票了哦~\n去给TA赠送礼物吧~'
          } else if (res.code === 0) {
            this.title = '投票成功'
            this.content = '感谢您的参与，您已给该选手增加了宝贵一票'
          } else if (res.code === 8) {
            this.title = '温馨提示'
            this.content = '您一天只能投三票哦~\n去给TA赠送礼物吧~'
          }
          this.dialog = 'block' //显示dialog
        })
      },
      //dialog 的监听方法
      dialogListener: function (data) {
        this.dialog = data.hide
      },
      //获取数据
      getDataList: function () {
        console.log('getDataList')
        let that = this
        this.page = 1
        let params = {
          uuid: this.config._uuid,
          page: this.page,
          rows: 10
        }
        console.log(params)
        //获取活动信息和参赛选手信息
        getStuAndAct(params, res => {
          if (res) {
            let activity = res.data.sysActiveList
            let voteNum = res.data.numb || 0
            let students = res.data.sysStudentList || []
            let studentCount = res.data.studentCount || 0
            if (!activity) {
              that.title = '温馨提示'
              that.content = '暂无活动信息，请联系管理员确认是否有此活动哦~'
              that.dialog = 'block' //显示dialog
              return
            }
            if (!students && students.length === 0) {
              return
            }
            sessionStorage.setItem('activityId', activity.activeId)
            that.voteNum = voteNum
            that.activityInfo = activity
            document.title = that.activityInfo.activeName
            //倒计时
            that.timeDiff
            that.dataList = students
            that.studentData = !!this.dataList
            that.count = studentCount
            that.isShowLoadMoreBtn(studentCount, that.page)
            let activeName = activity.activeName
            //获取活动访问量
            pv({activeId: this.activityInfo.activeId}, res => {
                that.pv = res.pv
                //获取活动图片
                getActivityImg({activeName: activeName}, res => {
                  if (res && res.data.length !== 0) {
                    store.setSharedImg(res.data[0].imgSource)
                    that.banner = res.data[0].imgSource
                    that.imgList = res.data
                    that.imageData = !!that.imgList
                  }
                })
              }
            )
          }
        })
      },
      /**
       * 是否显示加载更多按钮
       * @param total
       * @param curPage
       */
      isShowLoadMoreBtn (total, curPage) {
        let totalPage = Math.ceil(total / 10)
        this.isLoadMore = curPage < totalPage
      },
      //加载更多学生
      loadMoreStudent () {
        let that = this
        let params = {
          uuid: this.config._uuid,
          page: this.page + 1,
          rows: 10
        }
        //获取活动信息和参赛选手信息
        getStuAndAct(params, res => {
          let students = res.data.sysStudentList
          let count = res.data.studentCount
          if (students && students.length !== 0) {
            that.page += 1
            that.dataList = that.dataList.concat(students)
            that.studentData = !!that.dataList
            that.isShowLoadMoreBtn(count, that.page)
          }
        })
      }
    },
    computed: {
      /**
       * 活动开始时间
       * @returns {*|moment.Moment}
       */
      beginTime () {
        return moment(this.activityInfo.activeBegintime.replace(/-/g, '/'))
      },
      /**
       * 活动结束时间
       * @returns {*}
       */
      endTime () {
        return this.activityInfo.activeEndtime.replace(/-/g, '/')
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
      //倒计时
      timeDiff: function () {
        let that = this
        //活动开始时间戳
        let beginTime = moment(this.activityInfo.activeBegintime.replace(/-/g, '/'))
        //活动结束时间戳
        let endTime = moment(this.activityInfo.activeEndtime.replace(/-/g, '/'))
        let timeCount = setInterval(() => {
          //当前时间戳
          let nowTime = moment().valueOf()
          let timeDiff = ''
          if (store.isActivityNotBegin(nowTime, beginTime)) {
            //活动还未开始
            that.timeCountTitle = '距活动开始倒计时'
            timeDiff = beginTime - nowTime
          } else {
            if (!store.isActivityEnd(nowTime, endTime)) {
              //活动开始且未结束
              that.timeCountTitle = '距活动结束倒计时'
              timeDiff = endTime - nowTime
            } else {
              if (!timeDiff) {
                clearInterval(timeCount);
                [that.days, that.hours, that.minutes, that.seconds] = [0, 0, 0, 0];
                [that.title, that.content, that.dialog] = ['提示', '当前活动已结束', 'block']
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
          let seconds = Math.round(temp3 / 1000);
          [that.days, that.hours, that.minutes, that.seconds] = [days, hours, minutes, seconds]
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="less">
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
      }
    }
  }

  #main {
    width: 100%;
    background: #ecf0f5;
    height: auto;
    margin-bottom: 55px;
  }

  #banner {
    width: 100%;
    #image {
      width: 100%;
      height: 220px;
    }

  }

  /*计数器*/
  #counter {
    margin-left: 15px;
    margin-right: 15px;
    background: #3cb371;
    height: 55px;
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
    .li-item-time {
      & > span > span {
        color: red
      }

    }
  }

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

  ul {
    width: 100%;
    list-style: none;
  }

  #counter .weui-flex {
    font-size: 14px;
    padding: 5px;
  }

  .li-item {
    height: 55px;
    font-size: 12px;
  }

  .inline-flex {
    display: table-cell;
    vertical-align: middle;
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
  }

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

  .weui-btn {
    font-size: 14px !important;
    margin-left: 5px;
  }

  .line {
    margin: 13px 0px;
  }

  .marTop15 {
    margin-top: 15px;
  }

  .marTop30 {
    margin-top: 30px;
  }
</style>
