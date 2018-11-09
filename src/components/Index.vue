<template>
  <div id="main">
    <!--头部banner信息-->
    <div id="banner">
      <!--海报图-->
      <div id="image">
        <my-img imageSrc="path+banner" errorType="img" width="100%" class="banner-img"/>
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
                <span>{{count}}</span>
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
                <span>{{voteNum}}</span>
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
                <span>{{pv}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--倒计时-->
      <div id="countDown">
        <span style="color: #e46112;">活动结束倒计时</span>
        <ul>
          <li class="li-item-time">
            <span><span style="color:red">{{days}} </span>天</span>
          </li>
          <li class="li-item-time">
            <span><span style="color:red">{{hours}}</span> 小时</span>
          </li>
          <li class="li-item-time">
            <span><span style="color:red">{{minutes}}</span> 分</span>
          </li>
          <li class="li-item-time">
            <span><span style="color:red">{{seconds}}</span> 秒</span>
          </li>
        </ul>
        {{time}}
      </div>
    </div>
    <!--内容-->
    <div id="content">
      <!--搜索框-->
      <div id="search">
        <input type="text" v-model="keywords" placeholder="请输入"/>
        <!-- <button>搜  索</button> -->
        <div @click="search">
          <a class="weui-btn weui-btn_primary flex-grow">搜 索</a>
        </div>
      </div>
      <!--列表-->
      <div id="list" v-if="studentData===false">
        <div class="item" v-for="(item,index) in dataList" :key="index">
          <div @click="toDetailPage(item)">
            <span class="sort">{{item.studentNumb}}</span>
            <img v-if="item.studentImg===null" src="../assets/img/user.jpg" width="100%" height="150">
            <img v-else :src="path+item.studentImg" ref="errorImg" width="100%" height="150"/>
          </div>
          <div class="item-bottom">
            <span>{{item.studentName}} </span>
            <span class="vote" @click="vote(item.studentId)">投票</span>
          </div>
        </div>
      </div>
      <none-data class="index-none-data" v-else/>

      <div class="marTop15" v-show="dataList.length===10">
        <div class="weui-flex">
          <div class="weui-flex__item">
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
      <div class="marTop30" v-if="imageData===false">
        <ul>
          <li v-for="item in imgList" :key="item.id">
            <img v-if="item.id!==0" :src="path+item.imgSource" width="100%">
          </li>
        </ul>
      </div>
      <none-data class="index-none-data" v-else/>
    </div>
    <my-dialog :title="title" :content="content" :display="dialog" v-on:dialogListener="dialogListener"/>
  </div>
</template>

<script>
  import {
    vote,
    pv,
    login,
    getStuAndAct,
    search,
    getActivityImg
  } from '@/api/Service'
  import Dialog from './common/Dialog'
  import ImageError from './common/ImageError'
  import NoneData from './common/NoneData'

  export default {
    components: {
      'my-dialog': Dialog,
      'my-img': ImageError,
      'none-data': NoneData
    },
    data () {
      return {
        time: '',
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        imgList: [],
        banner: '',
        count: 0, //报名人数
        dataList: {}, //学生列表
        activityInfo: {}, //活动信息
        pv: 0, //访问量
        voteNum: 0, //投票总数
        title: '', //dialog title 信息
        content: '', //dialog 显示提示内容
        keywords: '', //搜索关键字
        dialog: 'none',
        path: 'http://47.100.243.198:8080',
        studentData: true,
        imageData: true
      }
    },
    created: function () {
      //倒计时
      this.timediff
      //判断用户是否登录
      if (sessionStorage.getItem('sessionId')) {
        this.getDataList()
      } else {
        //用户登录，获取sessionid
        login(res => {
          sessionStorage.setItem('sessionId', res.data.sessionid)
          this.getDataList()
        })
      }
    },
    mounted () {},
    // 监听,当路由发生变化的时候执行
    watch: {
      $route: {
        handler: function (val, oldVal) {
          console.log(val)
          this.getDataList()
        },
        // 深度观察监听
        deep: true
      }
    },
    methods: {
      //跳转到详情页面
      toDetailPage: function (userInfo) {
        this.$router.push({
          name: 'Detail',
          params: {userInfo: userInfo}
        })
      },
      //搜索
      search: function () {
        let params = {
          key: this.keywords,
          id: '',
          uuid: sessionStorage.getItem('uuid')
        }
        search(params, res => {
          this.dataList = []
          if (res.data) {
            this.dataList = res.data
          } else {
            this.title = '提示'
            this.content = '没有找到该选手'
            this.dialog = 'block' //显示dialog
          }
        })
      },
      //投票方法
      vote: function (studentId) {
        //接口请求参数
        let params = {
          openId: sessionStorage.getItem('openId'),
          studentid: studentId
        }

        //调用投票接口
        vote(params, res => {
          if (res.code === 7) {
            this.title = '投票失败'
            this.content = '请不要重复投票'
          } else if (res.code === 0) {
            this.title = '投票成功'
            this.content = '您已成功给该选手投票'
          } else if (res.code === 8) {
            this.title = '投票失败'
            this.content = '一天只能投三票'
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
        if(sessionStorage.getItem('uuid')){
          return
        }
        let params = {
          uuid: sessionStorage.getItem('uuid')
        }
        //获取活动信息和参赛选手信息
        getStuAndAct(params, res => {
          if(res){
            return
          }
          sessionStorage.setItem('activityId', res.activity[0].activeId)
          this.voteNum = res.voteNum
          this.activityInfo = res.activity[0]
          this.dataList = res.student
          this.studentData = (!this.dataList) ? true : false
          this.count = res.student.length
          let activeName = res.activity[0].activeName
          pv(
            {
              activeId: this.activityInfo.activeId
            },
            res => {
              this.pv = res.pv
              getActivityImg(
                {
                  activeName: activeName
                },
                res => {
                  this.banner = res.data[0].imgSource
                  this.imgList = res.data
                  this.imageData = (!imgList) ? true : false
                }
              )
            }
          )
        })
        //获取选手列表
        // getStudentList(params,res=>{
        //   console.log(res);
        //   this.count=res.count;
        //   this.dataList=res.data;
        // });
        //获取活动信息
        // getActivityInfo(params,res=>{
        //   console.log(res);
        //   this.activityInfo=res.data[0];
        //   pv({
        //     jessionid:sessionStorage.getItem("jessionid"),
        //     activeId:this.activityInfo.activeId
        //   },res=>{
        //     console.log(res);
        //     this.pv=res.pv;
        //   });
        // });
      }
    },
    computed: {
      //倒计时
      timediff: function () {
        const that = this
        let timecount = setInterval(() => {
          let endTime = ''
          if (this.activityInfo.activeEndtime) {
            endTime = this.activityInfo.activeEndtime + ' 00:00:00' //结束时间
          }
          let now = new Date()
          let timeDiff = new Date(endTime).getTime() - now.getTime()
          //时间差的毫秒数

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
          that.days = days
          that.hours = hours
          that.minutes = minutes
          that.seconds = seconds

          if (!timeDiff) {
            this.days = 0
            this.hours = 0
            this.minutes = 0
            this.seconds = 0
            clearInterval(timecount)
            this.title = '提示'
            this.content = '当前活动已结束'
            this.dialog = 'block' //显示dialog
          }
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .sort {
    background: #000000bd;
    color: #90ee90;
    padding: 5px;
    position: absolute;
    font-size: 12px;
  }

  #main {
    width: 100%;
    background: #ecf0f5;
    height: auto;
    margin-bottom: 55px;
  }

  #banner {
    width: 100%;
  }

  /*计数器*/
  #counter {
    margin-left: 15px;
    margin-right: 15px;
    background: #3cb371;
    height: 55px;
    color: #fff;
  }

  /*倒计时*/
  #countDown {
    margin-left: 15px;
    margin-right: 15px;
    background: #fff;
    height: 80px;
    padding-top: 10px;
    /* border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    box-shadow: 2px 0px 12px #b3b3b3; */
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
  }

  ul {
    width: 100%;
    list-style: none;
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

  /*图片列表*/
  .item {
    width: 45%;
    border-radius: 5px;
    margin-top: 15px;
    overflow: hidden;
    color: #2e8b57;
    font-size: 14px;
    background: #fff;
  }

  #list {
    display: flex;
    align-items: safe;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-left: 15px;
    margin-right: 15px;
  }

  .item-bottom {
    position: relative;
    width: 100%;
    background: #ffffff;
    height: 35px;
    line-height: 35px;
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
