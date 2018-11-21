<template>

  <!--详情页-->
  <div id="main">
    <my-header title="详情页"/>
    <!--头部用户信息-->
    <div id="header">
      <!--照片-->
      <div id="userImg">
        <my-img :imageSrc="path+data.studentImg" errorType="user" width="100%" height="300"/>
        <!--<img v-if="data.studentImg===null" src="../assets/img/user.jpg" width="100%">-->
        <!--<img v-else :src="path+data.studentImg" width="100%"/>-->
      </div>
      <!--<div @click="toPresentPage">-->
        <!--<div style="color:#0db52b">-->
          <!--去给TA加油打气>>-->
        <!--</div>-->
      <!--</div>-->
    </div>
    <!--内容-->
    <div id="content">
      <!--用户名-->
      <div id="userName">
        <!-- {{userName}} -->
        {{data.studentName}}
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
                <span>{{data.studentTicket}}</span>
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
                <span>{{rank}}</span>
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
      <!--礼物赠送列表-->
      <div id="list">
          <div class="menu">
              <div class="menu-icon">
                  <img src="../assets/img/menu-list.png" class="marL10"  />
              </div>

              <span class="menu-name">收到的礼物</span>
          </div>
          <div id="giftList">
              <ul  v-if="(giftList.length)!==0" >
                  <li class="card-item flex" v-for="item in giftList" :key="item.id">
                      <div class="fl grid marL10">
                        <my-img :imageSrc="item.headImgUrl" errorType="user" width="35" height="35"/>
                      </div>
                      <div class="fl grid marL10">
                          <div>
                              <span style="color:#26a69a">{{item.nickName}}</span>
                          </div>
                          <div>
                              <span style="color: #a22232;font-size: 12px;">赠送了{{item.giftCount}}个{{item.giftName}}</span>
                          </div>
                      </div>
                  </li>
              </ul>
            <div v-else class="card-item flex" style="justify-content: center;align-content: center">
                <div style="color: #ec8b89;line-height: 56px;">暂时还未收到礼物</div>
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
  import { config } from '../assets/js/config';
  import Header from './common/Header';
  import Dialog from './common/Dialog';
  import ImageError from './common/ImageError';
  import {search, vote , getUserGiftList } from '../api/Service';
  import store from '../assets/js/store';

  export default {
    components: {
      'my-dialog': Dialog,
      'my-header': Header,
      'my-img': ImageError,
    },
    data () {
      return {
        rank: 1,
        dialog: 'none',
        data: {},
        title: '',
        path: config.img_url,
        content: '',
        giftList:[]
      };
    },
    created: function () {
      this.data = this.$route.params.userInfo;
      alert(JSON.stringify(data))
    },
    mounted:function(){
      this.getUserInfo();
      window.addEventListener("popstate", function(e) {  //popstate监听返回按钮
        this.goBack();
      }, false);
    },
    methods: {
      //刷新选手信息
      refreshUserInfo:function(){
        let params = {
          key: this.data.studentName,
          id: this.data.studentId,
          uuid: store.state.uuid
        };
        search(params, res => {
          this.data=res.data[0];
          console.log('赠送礼物界面',res);
        });
      },
      //返回首页
      goBack: function () {
        this.$router.push('/index');
      },
      //跳转去礼物页面
      toPresentPage: function (userId) {
        this.$router.push({name: 'Present', params: {userInfo: this.data}});
      },
      //投票
      vote: function () {
        //接口请求参数
        let params = {
          jessionid: store.state.sessionId,
          openId: store.state.openId,
          studentid: this.data.studentId
        };

        //调用投票接口
        vote(params, res => {
          if (res.code === 7) {
            this.title = '温馨提示';
            this.content = '您已给该选手投过票了哦~\n去给TA赠送礼物吧~';
          } else if (res.code === 0) {
            this.title = '投票成功';
            this.content = '感谢您的参与，您已给该选手增加了宝贵一票';
            this.refreshUserInfo();
          } else if (res.code === 8) {
            this.title = '温馨提示';
            this.content = '您一天只能投三票哦~\n去给TA赠送礼物吧~';
          }
          this.dialog = 'block'; //显示dialog
        });
      },
      //dialog 事件监听器
      dialogListener: function (data) {
        this.dialog = data.hide;
      },
      //获取用户的信息
      getUserInfo () {
        let that=this;
        let params = {
          key: this.data.studentName,
          id: this.data.studentId,
          uuid: store.state.uuid
        };
        search(params, res => {
          this.data = res.data[0];
          this.rank = res.rank;
          // this.dataList = [];
          // this.dataList.push(res.data);

          getUserGiftList({
            uuid: store.state.uuid,
            studentId: that.data.studentId,
          },function (res) {
            that.giftList=res.data.resultMap;

            console.log('被赠送的礼物列表',that.giftList.length);
          });
        });
      }
    }
  };
</script>

<style scoped lang="less">
  #header{
    margin-top: 44px;
  }
  #main {
    background: #ecf0f5;
    min-height: calc(100% - 44px);
  }

  .bottom {
    width: 100%;
    position: fixed;
    bottom: 15px;
  }

  #giftList {
    width: 100%;
  }

  .card-item {
    background: #fff;
    width: 100%;
    height: 55px;
  }

  .flex {
    display: flex;
    border-bottom: 1px solid #ececec;
  }

  .grid {
    align-content: center;
    display: grid;
  }

  .menu {
    display: table;
    height: 35px;
  }

  .menu-icon {
    display: table-cell;
    vertical-align: middle;
    margin-left: 15px;
  }

  .menu-name {
    display: table-cell;
    vertical-align: middle;
    padding-left: 10px;
    color: #fff;
    font-size: 14px;
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

  .box-item {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    padding-left: 4px;
  }

  #footer {
    width: 100%;
    height: 44px;
    color: #fff;
    position: fixed;
    bottom: 0px;
    z-index: 1000;
  }

  #tab {
    display: flex;
  }

  .tab-item {
    height: 44px;
    flex-grow: 1;
  }

  .flex-grow {
    flex-grow: 1;
  }

  ul {
    width: 100%;
    list-style: none;
  }

  #content {
    margin-top: 10px;
  }

  #list {
    background: #3cb371;
    margin: 20px 15px 55px;
  }

  #userName {
    margin-left: 15px;
    margin-right: 15px;
    background: #fff;
    height: 35px;
    line-height: 35px;
    color: #2e8b57;
  }

  /*计数器*/
  #counter {
    margin-left: 15px;
    margin-right: 15px;
    background: #3cb371;
    height: 55px;
    color: #fff;
    /* box-shadow: 1px 4px 17px #1f8e84; */
  }

  #counter ul li {
    display: table;
    flex-grow: 1;
    font-size: 14px;
  }

  .li-item {
    height: 55px;
    font-size: 10px;
  }

  .inline-flex {
    display: table-cell;
    vertical-align: middle;
  }

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
</style>
