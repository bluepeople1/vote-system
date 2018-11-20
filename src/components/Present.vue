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
            <img v-if="userInfo.studentImg===null" src="../assets/img/user.jpg" class="userPhoto">
            <img v-else :src="path+userInfo.studentImg" class="userPhoto"/>
          </div>
        </div>

        <div class="weui-flex__item" style="display: flex;align-items: center;">
          <ul style="text-align:left;font-size:14px">
            <li>姓名：{{userInfo.studentName}}</li>
            <li>编号：{{userInfo.studentNumb}}</li>
            <li>票数：{{userInfo.studentTicket}} 票</li>
            <!-- <li>排名：</li> -->
          </ul>
        </div>
      </div>
    </div>
    <!--礼物选择-->
    <div id="gift">
      <div class="gift-title">
        礼物
      </div>
      <div class="dis-flex">
        <div class="dis-flex-grow gift-item " @click="changeGift(index)" v-for="(item,index) in dataList" :key="index">
          <div class="bg-white gift">
            <div>
              <my-img :imageSrc="path+item.giftImg" errorType="img" class="gift-icon" width="100%" height="150px"/>
              <!--<img src="../assets/img/sugar_64.png" >-->
            </div>
            <div>
              {{item.giftName}} +{{item.giftTicket}}票
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
  import Header from './common/Header';
  import Dialog from './common/Dialog';
  import { getGiftList, wxPay ,sendGift,search } from '../api/Service';
  import { config } from '../assets/js/config';
  import store from '../assets/js/store';
  import { sign } from '@/assets/js/sign';
  import wx from 'weixin-js-sdk';
  import ImageError from './common/ImageError';

  export default {
    components: {
      'my-dialog': Dialog,
      'my-header': Header,
      'my-img': ImageError,
    },
    data () {
      return {
        userInfo: this.$route.params.userInfo,
        dataList: [],
        price: 0, //单价
        num: 1, //数量
        giftName: '',
        giftId: '',
        giftTicket: '',
        title: '', //dialog title 信息
        content: '', //dialog 显示提示内容
        dialog: 'none', //dialog 的显示隐藏
        path: config.img_url
      };
    },
    created: function () {
      this.getGiftList();
    },
    computed: {
      totalPrices: function () {
        return this.num * this.price;
      }
    },
    methods: {
      refreshUserInfo:function(){
        let params = {
          key: this.userInfo.studentName,
          id: this.userInfo.studentId,
          uuid: store.state.uuid
        };
        search(params, res => {
          this.userInfo=res.data[0];
          console.log('赠送礼物界面',res);
        });
      },
      //dialog 的监听方法
      dialogListener: function (data) {
        this.dialog = data.hide;
      },
      pay: function () {
        const that = this;
        let outTradeNo="";  //订单号
        for(let i=0;i<6;i++){ //6位随机数，用以加在时间戳后面。
          outTradeNo += Math.floor(Math.random()*10);
        }
        outTradeNo = new Date().getTime() + outTradeNo;
        //调用微信支付
        wxPay({
            openId: store.state.openId,
            body: this.giftName,
            detail: '给用户增加' + this.giftTicket + '票',
            outTradeNo: outTradeNo,
            totalFee: this.num * this.price * 100
          }, res => {
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                'appId': res.data.appId,     //公众号名称，由商户传入
                'timeStamp': res.data.timeStamp,         //时间戳，自1970年以来的秒数
                'nonceStr': res.data.nonceStr, //随机串
                'package': res.data.package,
                'signType': res.data.signType,         //微信签名方式：
                'paySign': res.data.paySign //微信签名
              },
              function (res) {
                if (res.err_msg == 'get_brand_wcpay_request:ok') {
                  that.title = '赠送成功';
                  that.content ='成功给该选手增加了' + that.giftTicket * that.num + '票';
                  that.dialog = 'block';
                  sendGift({
                    uuid:store.state.uuid,
                    openId:store.state.openId,
                    accountAmt: that.price,
                    accountGiftid: that.giftId,
                    accountStudentid: that.userInfo.studentId,
                    accountNumb: that.num
                  },function () {
                    that.refreshUserInfo();
                  });
                }
              });

          }
        );

        //成功后跳转页面
        // this.$router.push({
        //   name: "Success",
        //   params: {
        //     payInfo: {
        //       payName: this.giftName,
        //       price: this.price,
        //       num: this.num,
        //       userInfo: this.$route.params.userInfo
        //     }
        //   }
        // });
        //失败后跳转页面
        // this.$router.push({
        //   name: "Failure",
        //   params: {
        //     payInfo: {
        //       payName: this.giftName,
        //       price: this.price,
        //       num: this.num,
        //       userInfo: this.$route.params.userInfo
        //     }
        //   }
        // });
      },
      subtract: function () {
        if (this.num !== 1) {
          this.num--;
        }
      },
      plus: function () {
        this.num++;
      },
      //返回上一页
      goBack: function () {
        this.$router.push({
          name: 'Detail',
          params: {userInfo: this.$route.params.userInfo}
        });
      },
      //去除选中样式
      removeClass: function (elements, cName) {
        elements.className = elements.className.replace(
          new RegExp('(\\s|^)' + cName + '(\\s|$)'),
          ' '
        ); // replace方法是替换
      },
      //改变礼物选中样式
      changeGift: function (n) {
        this.giftTicket = this.dataList[n].giftTicket;
        this.giftName = this.dataList[n].giftName;
        this.price = this.dataList[n].giftPrice;
        this.giftId = this.dataList[n].giftId;
        let gift = document.getElementsByClassName('gift');
        for (let i = 0; i < gift.length; i++) {
          this.removeClass(gift[i], 'activeTab');
        }
        gift[n].className += ' activeTab';
      },
      //获取礼物列表
      getGiftList: function (sessionid) {
        getGiftList(res => {
          console.log('礼物',res);
          this.dataList = res.data;
        });
      }
    }
  };
</script>

<style scoped lang="less">
  .activeTab {
    background: #efefef !important;
    border: 1px solid #ffc7c2 !important;
  }

  .bg-white {
    background: #fff;
    border: 1px solid #e2e2e2;
  }

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

  .totalPrices {
    display: flex;
    justify-content: space-between;
    margin: 15px 15px 100px;
  }

  .subtract-plus {
    width: 34px;
  }

  .price {
    color: red;
    font-weight: bold;
  }

  #main {
    background: #ecf0f5;
    min-height: calc(100% - 44px);
  }

  #gift {
    margin-left: 15px;
    margin-right: 15px;
    color: #ea006a;
    font-size: 14px;
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

  .block {
    display: block;
  }

  .flex {
    display: flex;
    border-bottom: 1px solid #ececec;
  }

  .dis-flex {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    margin: 0px -2px;
  }

  .dis-flex-grow {
    flex: 0 0 50%;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
    -webkit-transition: all 0.5s ease;
    transition: all 0.5s ease;
    padding: 2px;
  }

  .gift-item {
    height: 185px;
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

  .box {
    height: 44px;
    display: inline-flex;
    display: table;
  }

  #footer {
    width: 100%;
    height: 44px;
    color: #fff;
    position: fixed;
    bottom: 0px;
    z-index: 1000;
  }

  ul {
    width: 100%;
    list-style: none;
  }

  .userPhoto {
    border-radius: 50px;
    width: 100px;
  }

  .weui-btn {
    font-size: 14px !important;
  }

  .userInfo {
    background: #fff;
    margin-top: 55px !important;
    margin: 0 15px;
  }

  #userImg {
    display: flex;
    justify-content: center;
    padding: 15px;
    & > img {
      width: 70px;
      height: 70px;
    }
  }
</style>
