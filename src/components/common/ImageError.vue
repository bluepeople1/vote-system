<template>
  <div id="error">
    <img v-if='errorType==="user"' :src="path+imageSrc" :onerror="userErr"/>
    <img v-if='errorType==="img"' :src="path+imageSrc" :onerror="imgErr"/>
  </div>
</template>

<script>
  export default {
    name: 'ImageError',
    data () {
      return {
        path:'http://www.hzrtpxt.top',
        imgErr: 'this.src="' + require('../../assets/img/errorImg.png') + '"',
        userErr: 'this.src="' + require('../../assets/img/user.jpg') + '"'
      }
    },
    props: {
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
  #error{
    & > img{
      height: 170px;
      width: 100%;
    }
  }


</style>
