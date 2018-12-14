<template>
  <div id="container">
    <div id="marquee">
      <span id="title" :class="content?'play':''">{{content}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyMarquee',
    props: {
      content: String
    }
  }
</script>

<style scoped lang="less">
  #container {
    position: fixed;
    top: 0;
    width: 100%;
    height: 30px;
    background-color: rgba(9, 187, 7, 0.65);
    overflow: hidden;
    z-index: 1500;
    #marquee {
      width: 100%;
      position: relative;
      height: 30px;
      line-height: 30px;
      color: #fff;
      #title {
        min-width: 100%;
        height: 30px;
        white-space: nowrap;
        position: absolute;
        text-wrap: none;
        /*animation: marquee-title 35s linear infinite;*/
      }
    }
  }

  @keyframes marquee-title {
    from {
      transform: translateX(25%);
    }
    to {
      transform: translateX(-100%);
    }
  }

  /*动画开始*/
  .play {
    animation: marquee-title 25s linear infinite;
  }
</style>
