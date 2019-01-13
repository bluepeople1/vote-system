<template>
  <div id="main">
    <!--礼物赠送列表-->
    <div id="list" v-if="noneData===true">
      <div id="rankList">
        <ul>
          <li class="card-item flex" v-for="(item,index) in dataList" :key="index" @click="toDetailPage(item)">
            <div v-show="index===0" style="display: flex;align-items: center;">
              <img src="../assets/img/champion_32.png" alt="">
            </div>
            <div v-show="index===1" style="display: flex;align-items: center;">
              <img src="../assets/img/second_32.png" alt="">
            </div>
            <div v-show="index===2" style="display: flex;align-items: center;">
              <img src="../assets/img/third_32.png" alt="">
            </div>
            <div v-show="(index>2)" class="rank">
              {{index+1}}
            </div>

            <div class="fl grid marL10">
              <!--<img v-if="item.studentImg===null" src="../assets/img/user.jpg" style="width: 45px;height: 45px;"> -->
              <my-img :imageSrc="path+item.studentImg" errorType="user" width="45px" height="45px"/>
            </div>
            <div class="fl grid marL10">
              <div class="userName">
                <span>{{item.studentName}}</span>
              </div>
              <div>
                <span style="color: #a22232;font-size: 12px;">总票数：{{item.studentTicket}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <none-data class="none-data" v-else/>
    <my-dialog :title="title" :content="content" :display="dialog"
               v-on:dialogListener="dialogListener"/>
  </div>
</template>

<script>
  import { login, getRankingList } from '@/api/Service';
  import Dialog from './common/Dialog';
  import NoneData from './common/NoneData';
  import ImageError from './common/ImageError';
  import moment from 'moment';
  import CommonService from '../assets/js/common'

  export default {
    components: {
      'my-dialog': Dialog,
      'none-data': NoneData,
      'my-img': ImageError,
    },
    data () {
      return {
        title:'',
        content:'',
        dialog:'none',
        dataList: [],
        path: this.config._img_url,
        noneData: false//暂无数据，默认false
      };
    },
    created: function () {
      this.getRankingList();
    },
    methods: {
      //dialog 的监听方法
      dialogListener: function (data) {
        this.dialog = data.hide;
      },
      toDetailPage: function (userInfo) {

        //如果当前活动还未开始，不让投票
        if (CommonService.isActivityNotBegin(this.nowTime, this.beginTime)) {
          [this.title, this.content, this.dialog] = ['温馨提示', '活动还未开始呢~', 'block'];
          return;
        }
        //如果活动已经结束了，不让投票
        if (CommonService.isActivityEnd(this.nowTime, this.endTime)) {
          [this.title, this.content, this.dialog] = ['温馨提示', '活动已经结束啦~', 'block'];
          return;
        }
        this.$router.push({
          name: 'Detail',
          params: {userInfo: userInfo}
        });
      },
      //获取排行榜列表
      getRankingList () {
        getRankingList({uuid: this.config._uuid}, res => {
            this.dataList = res.data;
            this.noneData = !!this.dataList;
          }
        );
      }
    },
    computed:{
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
      }
    }
  };
</script>

<style scoped>
  #main {
    min-height: 100vh;
  }

  .rank {
    font-size: 16px;
    color: #d81111;
    font-weight: bold;
    width: 32px;
    line-height: 55px;
  }

  #rankList {
    margin-top: 35px;
    margin-bottom: 55px;
  }

  .card-item {
    background: #fff;
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

  ul {
    list-style: none;
  }

  #list {
    background: #26a69a;
    margin-left: 15px;
    margin-right: 15px;
    box-shadow: 1px 4px 17px #c7c7c7;
  }

  .userName {
    text-align: left !important;
    color: #26a69a;
  }

</style>
