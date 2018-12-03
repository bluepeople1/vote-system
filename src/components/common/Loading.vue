<template>
  <div class="loading-page" v-if="isShow" @click="stop">
    <div class="loading-box">
      <div :data-loader="loaderType.circle" ></div>
      <span>正在火速加载中...</span>
    </div>
  </div>
</template>

<script>
  import 'css-loading'
  export default {
    name: 'Loading',
    props:{
      isShow:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        loaderType:{
          circle:'circle',
          circleSide:'circle-side',
          arrowCircle:'arrow-circle',
          ballScale:'ball-scale',
          ballCircle:'ball-circle',
          rectangle:'rectangle',
          heart:'heart',
          ballRotate:'ball-rotate',
          ballPulse:'ball-pulse',
          jumping:'jumping',
          satellite:'satellite',
          circleScale:'circle-scale',
          ballFade:'ball-fade',
          spinner:'spinner',
          ballRoll:'ball-roll',
          ballAuto:'ball-auto',
          wave:'wave',
          spinnerCircle:'spinner-circle',
          circleClock:'circle-clock',
          pxSpinner:'500px-spinner',
          timer:'timer'
        }
      }
    },
    methods:{
      stop(){
        this.$store.dispatch('hideLoading')
      }

    }
  }
</script>

<style scoped lang="less">
  .loading-page{
    overflow: hidden;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    .loading-box{
      width: 45%;
      height: 20%;
      margin: auto;
      background: rgb(0, 0, 0);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      opacity: 0.5;
      z-index: 10;

      & > span{
        margin-top: 10px;
        color: #fff;
        font-size: 12px;
      }
    }
  }

</style>
