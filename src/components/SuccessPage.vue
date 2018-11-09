<template>
    <div class="page msg_success js_show">
        <div class="weui-msg">
            <div class="weui-msg__icon-area"><i class="weui-icon-success weui-icon_msg"></i></div>
            <div class="weui-msg__text-area">
                <h2 class="weui-msg__title">赠送成功</h2>
                <p class="weui-msg__desc">您已成功给该选手赠送了{{data.num}}个{{data.payName}}，增加了{{ticketNum}}票<router-link to="/list" tag="a">去查看排行榜</router-link></p>
            </div>
            <div class="weui-msg__opr-area">
                <p class="weui-btn-area">
                    <a class="weui-btn weui-btn_primary" @click="goBackToPresent">继续赠送</a>
                    <a class="weui-btn weui-btn_default" @click="goToIndex">返回首页</a>
                </p>
            </div>
            <div class="weui-msg__extra-area">
                <div class="weui-footer">
                    <p class="weui-footer__links">
                        <a href="javascript:void(0);" class="weui-footer__link">投票系统</a>
                    </p>
                    <p class="weui-footer__text">Copyright © 2018-2019 投票系统</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      data: {}
    };
  },
  created: function() {
    console.log(this.$route.params);
    this.data = this.$route.params.payInfo;
  },
  methods: {
    //返回赠送礼物页面
    goBackToPresent: function() {
      this.$router.push({
        name: "Present",
        params: { userInfo: this.$route.params.payInfo.userInfo }
      });
    },
    //返回首页
    goToIndex: function() {
      this.$router.push({name:"Index",params:{uuid: sessionStorage.getItem('uuid')}});
    }
  },
  computed: {
    ticketNum: function() {
      if(this.data.price===2){
        
      }
      return this.data.price * 5 * this.data.num;
    }
  }
};
</script>

<style>
</style>
