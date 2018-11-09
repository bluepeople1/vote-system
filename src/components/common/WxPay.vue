<template>

</template>

<script>
  import wx from 'weixin-js-sdk';

  export default {
    name: "WxPay",
    data() {
      return {
        wx: null
      };
    },
    created() {
      let config = {};
      config.url = window.location.href; // 当前页面url
      config.url = window.location.href;
      // 判断当前url是否存在?参数匹配符
      if(!config.url.match(/\?/)) {
        location.replace(window.location.href.split('#')[0] + '?' + window.location.hash);
        return ;
      }

      // 请求api返回sdk配置参数
      this.$http.post('/api/wx/sdk-config', config).then(ret => {
        config = ret.data.config;
        config.debug = true;

        config.jsApiList = [
          'chooseWXPay'
        ];
        wx.config(config);
        wx.ready(() => {
          this.wx = wx;
        });
      });
    },
    methods : {
      // 请求api创建本地订单
      makeOrder() {
        this.$http.post('/api/user/recharge').then(ret => {
          this.makeWxOrder(ret.data.orderId);
        });
      },

      // 请求api创建微信订单并拉取支付控件
      makeWxOrder(orderId) {
        this.$http.post('/api/wx/make-order', {orderId: orderId}).then(ret => {
          // 得到返回的支付参数
          let params = ret.data.params;
          params.success = res => {
            // 支付成功
          };
          this.wx.chooseWXPay(params);
        });
      }
    }
  };
</script>

<style scoped>

</style>
