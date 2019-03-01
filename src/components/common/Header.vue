<template>
  <div class="header">
    <div class="backBtn" @click="back">
      <img src="../../assets/img/back_arrow.png" width="36"/>
      <span>返回</span>
    </div>
    <span class="til">{{title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '六弦志合投票系统'
    }
  },
  methods: {
    back: function () {
      this.$router.push('/index')
    }
  }
}
</script>

<style lang="less">
  .header {
    width: 100%;
    height: 44px;
    line-height: 44px;
    color: #fff;
    background: #3cb371;
    position: fixed;
    top: 0;
    .backBtn {
      position: absolute;
      left: 15px;
      img {
        width: 8px;
        margin-right: 5px;
      }
    }
    .til {
      font-size: 16px;
    }
  }

</style>
