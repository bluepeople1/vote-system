<template>
  <div id="main">

    <div style="margin: 35px 15px;">
      <ul style="width:100%">

        <li style="width:100%">
          <div class="panel">
            <div class="title">
              <div style="height:30px">奖品展示</div>
            </div>
            <div v-if="noneData===true">
              <div>
                <ul class="margin10">
                  <li v-for="item in dataList" :key="item.id" style="display: unset!important;width:100%">
                    <div class="prizeName">
                      {{item.prizeName}}
                    </div>
                    <div>
                      <!--<img v-if="item.prizeImg!==null" :src="path+item.prizeImg" width="65%">-->
                      <my-img :imageSrc="path+item.prizeImg" errorType="img" width="100%" height="auto"/>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <none-data class="index-none-data" v-else/>
          </div>
        </li>
        <li>
          <div class="panel">
            <div class="title">
              <div style="height:30px">活动规则</div>
            </div>
            <div>
              <ul style="text-align:left;margin:10px">
                <!--<li>-->
                  <!--(一)【礼物功能郑重声明】赠送一点礼物为一元钱可自动兑换票数5票(每个礼物对应的点数不同)。赠送礼物除增加票数外无任何其他功能，所有礼物均为用户自愿购买，购买礼物后本平台不退不换，参与投票奖品价值有限，不要恶意攀比，恶意竞争，本平台不承担任何法律责任。-->
                <!--</li>-->
                <li>【温馨提示】</li>
                <li>1.活动期间每个微信号每天可投3票，给同一选手一天限投1票。</li>
                <li>2.比赛成绩按照票数评选，票数最多，排名第一。</li>
                <li>3.活动以友好、和谐、丰富文化生活为宗旨!礼品价值有限，请不要恶意攀比、恶意竟争!</li>
                <li>4.活动期间如出现异常，属于短时间投票人数过多，请重新点开链接。</li>
                <li>【禁止刷票】</li>
                <li>平台24小时采取动态监测，智能拦截网络刷票数据（时间 环境 热度 IP 曲线峰值
                  等），严厉杜绝任何利用网络作弊投票行为，活动过程中如果发现票数异常，本平台将对网络刷票者做出减票，锁定，严重者甚至取消参赛资格，滚动字幕公之于众等方法处理。我们将保留作弊投票行为之截图、监控数据库作为证据保留。希望大家积极举报有关恶意刷票行为。
                </li>
                <li>【其他注意事项】</li>
                <li>1.禁止用他人照片或冒用他人名义参赛，一经发现，取消参赛资格。</li>
                <li>2.一旦参赛，本活动格认定参赛者提供了自己照片的合法使用授权，不再另行协议。</li>
                <li>3.本平台将会严肃处理。对蓄意诽谤、破坏、干扰活动的恶意言论及行为，本公司将诉诸法律手段维护本次活动的合法权益。</li>
                <li>4.活动重在参与，意在宣传推广，礼物设置跟园区无关，是系统自带模块，是为了防止外部刷票造成服务器混乱，我们不提倡赠送礼物，赠送礼物属自愿行为，活动主办方保留最终解释权！</li>
              </ul>
            </div>
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
  import { getPrizeList } from '@/api/Service';
  import NoneData from './common/NoneData';
  import ImageError from './common/ImageError';
  import {config} from '../assets/js/config';
  import store from '@/assets/js/store';

  export default {
    components: {
      'none-data': NoneData,
      'my-img': ImageError
    },
    data () {
      return {
        dataList: [],
        path: config.img_url,
        noneData: false//没有数据,默认false
      }
    },
    created: function () {
      getPrizeList({uuid: store.state.uuid}, res => {
        // console.log('prize',res)
        if(res.data.sysPrizes){
          this.dataList = res.data.sysPrizes;
          this.noneData = !!this.dataList;
        }
      });
    }
  }
</script>

<style scoped>
  #main {
    background: #ecf0f5;
    min-height: 100vh;
  }

  .marT10 {
    margin-top: 10px;
  }

  .panel {
    width: 100%;
    background: #fff;
  }

  .title {
    background: #3cb371;
    height: 35px;
    line-height: 35px;
    color: #fff;
  }

  .prizeName{
    font-size: 18px;
    padding: 5px;
    background: #ff3b30;
    color: #ffffff;
  }

  ul {
    list-style: none;

    color: #757575;
    font-size: 14px;
    margin-bottom: 55px;
  }

  li {
    display: inline-flex;
    margin-bottom: 8px;

  }

  .margin10 {
    margin: 10px;
  }

  .overflow {
    overflow: hidden;
  }

</style>
