<template>
  <div id="container">
    <div class="title">{{id}}选手</div>
    <div class="header">
      <!--<img-error  :imageSrc="img_url" errorType="user" width="100%"></img-error>-->
      <div class="user-photo">
        <img :src="img_url">
      </div>

      <div class="content">
        <div class="ranking">
          第&nbsp;&nbsp;&nbsp;<span class="rank-num">155</span>&nbsp;&nbsp;&nbsp;名
        </div>
        <div class="info">
          <span class="name">毛雅</span>
        </div>
      </div>
    </div>
    <div class="btns">
      <div>支持一下</div>
      <div>进入活动</div>
      <div>赠送礼物</div>
    </div>
  </div>
</template>
<script>
  import ImageError from './common/ImageError';

  export default {
    props: ['id'],
    components: {
      ImageError
    },
    data () {
      return {
        img_url: require('../assets/img/boy.jpg')
      };
    },
    created: function () {
      let params = {
        key: this.data.studentName,
        id: this.data.studentId,
        uuid: store.state.uuid
      };
      document.title = '毛雅';
    },
    mounted: function () {

    }
  };
</script>

<style scoped lang="less">
  #container {
    width: 100vw;
    height: 100vh;
    display: block;
    .title{
      height: 45px;
      line-height: 45px;
      color: #ffffff;
      background-color: #0bb20c;
    }
    .header {
      margin: 10px;
      padding: 10px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      text-align: center;
      .user-photo {
        & > img {
          width: 95%;
          height: 350px;
        }
      }

      .content {
        .ranking {
          font-size: 18px;
          .rank-num {
            color: #0e9807;
            font-weight: bold;
            font-size: 32px;
          }
        }
        .info {
          font-size: 20px;
          color: #067100;
          .serial-number {

          }
        }
      }
    }
    .btns{
      width: 100%;
      position: fixed;
      bottom: 0;
      background-color: #ffffff;
      padding: 10px;
      display: flex;
      justify-content: space-around;
      div{
        background-color: #0bb20c;
        height: 16px;
        line-height: 16px;
        color: #ffffff;
        border-radius: 5px;
        padding: 10px;
      }
    }
  }
</style>
