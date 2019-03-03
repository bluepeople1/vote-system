<template>
  <!--详情页-->
  <div id="main">
    <my-header title="赠送礼物"/>
    <!--内容-->
    <div id="header">
      <div class="weui-flex userInfo">
        <div class="weui-flex__item ">
          <div id="userImg">
            <!--用护照片-->
            <img v-if="studentInfo.studentHeadIma === null" src="../assets/img/user.jpg" class="userPhoto">
            <img v-else :src="studentInfo.studentHeadIma" class="userPhoto"/>
          </div>
        </div>

        <div class="weui-flex__item" style="display: flex;align-items: center;">
          <ul style="text-align:left;font-size:14px">
            <li>姓名：{{studentInfo.studentName}}</li>
            <li>编号：{{studentInfo.studentCode}}</li>
            <li>票数：{{studentInfo.studentVoteNumber || 0}} 票</li>
            <!-- <li>排名：</li> -->
          </ul>
        </div>
      </div>
    </div>
    <!--礼物选择-->
    <div id="gift">
      <div class="gift-title">礼物</div>
      <div class="dis-flex">
        <div class="dis-flex-grow gift-item " @click="changeGift(index)" v-for="(item,index) in dataList" :key="index">
          <div class="bg-white gift">
            <div>
              <my-img :imageSrc="item.giftIma"
                      errorType="img"
                      class="gift-icon"
                      width="100%"
                      height="150px"/>
              <!--<img src="../assets/img/sugar_64.png" >-->
            </div>
            <div>
              {{item.giftName}} +{{item.giftToVotes}}票
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="totalPrices">
      <div>
      </div>
      <div>
        <div class="totalNum">
          <div class="subtract-plus" @click="subtract"> -</div>
          <div class="num">{{num}}</div>
          <div class="subtract-plus" @click="plus"> +</div>
        </div>
      </div>
    </div>
    <!--底部-->
    <div id="footer">
      <div class="weui-flex">
        <!-- <div class="weui-flex__item" @click="goBack">
          <div class="placeholder" style="margin:0 15px;"><a class="weui-btn weui-btn_default flex-grow">返回</a></div>
        </div> -->
        <div class="weui-flex__item" @click="pay">
          <div class="placeholder" style="margin:0 15px;"><a class="weui-btn weui-btn_primary flex-grow">微信支付 <span
            class="price">{{totalPrices}}</span> 元</a></div>
        </div>
      </div>
    </div>
    <my-dialog :title="title" :content="content" :display="dialog" v-on:dialogListener="dialogListener"/>
  </div>
</template>

<script>
import Header from './common/Header'
import Dialog from './common/Dialog'
import apiService from '../api/Service'
import {sign} from '@/assets/js/sign'
import ImageError from './common/ImageError'
import CommonService from '../assets/js/common'

export default {
  components: {
    'my-dialog': Dialog,
    'my-header': Header,
    'my-img': ImageError
  },
  data () {
    return {
      studentInfo: {},
      loginId: this.$route.params.loginId,
      activityId: this.$route.params.activityId,
      studentId: this.$route.params.studentId,
      dataList: [],
      price: 0, //单价
      num: 1, //数量
      giftName: '',
      giftId: '',
      giftTicket: '',
      title: '', //dialog title 信息
      content: '', //dialog 显示提示内容
      dialog: 'none', //dialog 的显示隐藏
      wxUserInfo: {}//微信用户信息
    }
  },
  created: function () {
    let ajaxArr = [
      this.getStuInfo(),
      this.getGiftList()
    ]
    Promise.all(ajaxArr).then(res => {
      this.studentInfo = res[0].resultObject.studentInfo
      this.dataList = res[1].resultObject.activityGift
    })

  },
  computed: {
    /**
     * 当前配置信息
     */
    config () {
      return this.$store.getters.config
    },
    totalPrices: function () {
      return this.num * this.price
    }
  },
  mounted: function () {
    window.addEventListener('popstate', e => {  //popstate监听返回按钮
      this.backToIndex()
    }, false)
  },
  methods: {
    refreshUserInfo () {
      Promise.all([this.getStuInfo()]).then(res => {
        this.studentInfo = res[0].resultObject.studentInfo
      })
    },
    backToIndex: function () {
      this.$router.push('/index')
    },
    //dialog 的监听方法
    dialogListener: function (data) {
      this.dialog = data.hide
    },
    pay: function () {
      const that = this
      let outTradeNo = ''  //订单号
      for (let i = 0; i < 6; i++) { //6位随机数，用以加在时间戳后面。
        outTradeNo += Math.floor(Math.random() * 10)
      }
      outTradeNo = new Date().getTime() + outTradeNo
      //调用微信支付
      apiService.wxPay(this, {
        openid: this.config.openId,
        outTradeNo: outTradeNo,
        totalFee: this.num * this.price * 100,
        body: this.giftName,
        detail: '给用户增加' + this.giftTicket + '票',
        studentId: this.studentId,
        activityId: this.activityId,
        loginId: this.loginId,
        nickName: this.config.nickName,
        headImgUrl: this.config.headImgUrl,
        giftId: this.giftId,
        giftCount: this.num
      }).then(data => {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': data.appId,     //公众号名称，由商户传入
            'timeStamp': data.timeStamp,         //时间戳，自1970年以来的秒数
            'nonceStr': data.nonceStr, //随机串
            'package': data.package,
            'signType': data.signType,         //微信签名方式：
            'paySign': data.paySign //微信签名
          }, (res) => {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              that.title = '赠送成功'
              that.content = '成功给该选手增加了' + that.giftTicket * that.num + '票'
              that.dialog = 'block'
              that.refreshUserInfo()
            }
          })
      })
    },
    subtract () {
      if (this.num !== 1) {
        this.num--
      }
    },
    plus () {
      this.num++
    },
    //去除选中样式
    removeClass: function (elements, cName) {
      elements.className = elements.className.replace(
        new RegExp('(\\s|^)' + cName + '(\\s|$)'),
        ' '
      ) // replace方法是替换
    },
    //改变礼物选中样式
    changeGift: function (n) {
      this.giftTicket = this.dataList[n].giftToVotes
      this.giftName = this.dataList[n].giftName
      this.price = this.dataList[n].giftPrice
      this.giftId = this.dataList[n].id
      let gift = document.getElementsByClassName('gift')
      for (let i = 0; i < gift.length; i++) {
        this.removeClass(gift[i], 'activeTab')
      }
      gift[n].className += ' activeTab'
    },
    //获取礼物列表
    getGiftList: function () {
      return new Promise((resolve, reject) => {
        apiService.getGiftList(this, {
          loginId: this.loginId
        }).then(success => {
          resolve(success)
        }, err => {
          reject(err)
        })
      })
    },
    /**
     * 获取选手信息
     * @returns {Promise<any>}
     */
    getStuInfo () {
      return new Promise((resolve, reject) => {
        apiService.getStuDetailInfo(this, {
          loginId: this.loginId,
          activityId: this.activityId,
          studentId: this.studentId
        }).then(success => {
          resolve(success)
        }, err => {
          reject(err)
        })
      })
    }
  }
  ,
  beforeDestroy () {
    // this.$jquery(window).off('popstate');
    window.removeEventListener('popstate', function () {

    }, false)
  }
}
</script>

<style scoped lang="less">
  .activeTab {
    background: #efefef !important;
    border: 1px solid #ffc7c2 !important;
  }

  #main {
    background: #ecf0f5;
    min-height: calc(100% - 44px);
    #header {
      margin-top: 44px;
      .userInfo {
        background: #fff;
        margin: 0 15px;
        #userImg {
          display: flex;
          justify-content: center;
          padding: 15px;
          .userPhoto {
            border-radius: 50px;
          }
          & > img {
            width: 70px;
            height: 70px;
          }
        }
      }
      ul {
        width: 100%;
        list-style: none;
      }
    }
    .totalPrices {
      display: flex;
      justify-content: space-between;
      margin: 15px 15px 100px;
      .num {
        font-size: 14px;
        width: 40px;
        border-left: 1px solid #e4e4e4;
        border-right: 1px solid #e4e4e4;
      }
      .totalNum {
        display: inline-flex;
        border: 1px solid #e4e4e4;
        border-radius: 3px;
        height: 20px;
        line-height: 20px;
      }
      .subtract-plus {
        width: 34px;
      }
    }
    #gift {
      margin-left: 15px;
      margin-right: 15px;
      color: #ea006a;
      font-size: 14px;
      .bg-white {
        background: #fff;
        border: 1px solid #e2e2e2;
      }
      .dis-flex {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        margin: 0px -2px;
        .dis-flex-grow {
          flex: 0 0 50%;
          box-sizing: border-box;
          overflow: hidden;
          text-align: center;
          -webkit-transition: all 0.5s ease;
          transition: all 0.5s ease;
          padding: 2px;
        }
      }
      .gift-title {
        background: #3cb371;
        height: 35px;
        color: #fff;
        /* -webkit-box-shadow: 1px 4px 17px #1f8e84; */
        /* box-shadow: 1px 4px 17px #1f8e84; */
        margin-top: 15px;
        line-height: 35px;
      }
      .big-gift {
        height: 160px;
        border-left: 1px solid rgb(112, 181, 178);
        border-right: 1px solid rgb(112, 181, 178);
        border-bottom: 1px solid rgb(112, 181, 178);
      }
      .gift-item {
        height: 185px;
      }
    }
    #footer {
      width: 100%;
      height: 44px;
      color: #fff;
      position: fixed;
      bottom: 0;
      z-index: 1000;
      .price {
        color: red;
        font-weight: bold;
      }
    }
    .weui-btn {
      font-size: 14px !important;
    }
  }

</style>
