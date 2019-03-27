<template>
  <div class="image">
    <img v-if='errorType==="user"'
         v-lazy="imageSrc"
         :key="imageSrc"
         :onerror="userErr"
         :width="width"
         :height="height"/>
    <img v-if='errorType==="img"'
         class="bigImage"
         v-lazy="imageSrc"
         :key="imageSrc"
         :onerror="imgErr"
         :width="width"
         :height="height"/>
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
    errorType: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="less">
  .image {
    display: flex;
    img {
      flex: 1 1 auto;
    }
    .bigImage {
      margin: 8px 0;
      width: 100%;
      height: 100%;
      background-size: contain;
    }
  }
</style>
