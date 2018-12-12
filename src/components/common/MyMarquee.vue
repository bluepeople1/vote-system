<template>
  <div id="container">
    <div id="marquee">
      <span id="title">{{content}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyMarquee',
  props: {
    content: {
      type: String,
      default: '暂无信息'
    }
  }
}
</script>

<style scoped lang="less">
  #container {
    position: relative;
    width: 100%;
    height: 30px;
    /*background-color: rgba(9, 187, 7, 0.65);*/
    overflow: hidden;
    z-index: 1500;
    #marquee {
      position: relative;
      height: 30px;
      line-height: 30px;
      color: #fff;
      #title {
        width: 100%;
        height: 30px;
        white-space: nowrap;
        position: absolute;
        text-wrap: none;
        animation: marquee-title 60s linear infinite;
      }
    }
  }

  @keyframes marquee-title {
    from {
      right: -100%;
    }
    to {
      right: 100%;
    }
  }
</style>
