<template>
  <div>
    <img v-if='errorType==="user"' :src="imageSrc" :onerror="userErr"/>
    <img v-if='errorType==="img"' :src="imageSrc" :onerror="imgErr"/>
  </div>
</template>

<script>
  export default {
    name: 'ImageError',
    data () {
      return {
        imgErr: 'this.src="' + require('../../assets/img/errorImg.png') + '"',
        userErr: 'this.src="' + require('../../assets/img/errorImg.png') + '"'
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

<style scoped>

</style>
