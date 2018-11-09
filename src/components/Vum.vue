<template>
  <div>
    
  </div>
</template>
<script>
export default {
    created:function(){
        console.log('当前页面地址：',window.location.href);
        window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx339df95d83b73048&redirect_uri=http%3A%2F%2F61459903.ngrok.io%2Fmaster%2Flogin&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect")
    },
    mounted:function(){
        console.log('当前页面地址：',window.location.href);
    }
}
</script>