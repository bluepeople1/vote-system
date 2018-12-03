<template>
  <div id="error">
    <img v-if='errorType==="user"' v-lazy="imageSrc" :onerror="userErr" :width="width" :height="height"/>
    <img v-if='errorType==="img"' v-lazy="imageSrc" :onerror="imgErr" :width="width" :height="height" />
  </div>
</template>

<script>
  export default {
    name: 'ImageError',
    data () {
      return {
        imgErr: 'this.src="' + require('../../assets/img/errorImg.png') + '"',
        userErr: 'this.src="' + require('../../assets/img/user.jpg') + '"'
      }
    },
    props: {
      width: {
        type: String,
        default: ''
      },
      height: {
        type: String,
        default: ''
      },
      imageSrc: {
        type: String,
        default: ''
      },
      errorType:{
        type:String,
        default:''
      }
    }
  }
</script>

<style scoped lang="less">
  /*#error{*/
    /*& > img{*/
      /*height: 170px;*/
      /*width: 100%;*/
    /*}*/
  /*}*/


</style>
