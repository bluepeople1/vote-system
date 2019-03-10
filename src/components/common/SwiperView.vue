<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <!-- slides -->
    <swiper-slide v-for="(item, index) in dataList" :key="index">
      <my-img :imageSrc="item" errorType="img" class="banner-img" />
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
  <!--<div v-swiper:mySwiper="swiperOption">-->
  <!--<div class="swiper-wrapper">-->
  <!--<div class="swiper-slide" v-for="(item, index) in dataList" :key="index">-->
  <!--<my-img :imageSrc="path + item" errorType="img" class="banner-img" width="100%" height="170px"/>-->
  <!--</div>-->
  <!--</div>-->
  <!--&lt;!&ndash;<div class="swiper-pagination"></div>&ndash;&gt;-->
  <!--</div>-->
</template>

<script>
import ImageError from './ImageError'

export default {
  components: {
    'my-img': ImageError
  },
  name: 'SwiperView',
  props: {
    dataList: Array,
    height: Number
  },
  data () {
    return {
      path: 'http://www.yaqinkeji.top',
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        }
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted () {
    // current swiper instance
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
    console.log('this is current swiper instance object', this.swiper)
    // this.swiper.slideTo(3, 1000, false)
  }
}
</script>

<style scoped lang="less">
  .swiper-container {
    height: 220px !important;
  }

  /deep/ .swiper-pagination-bullet-active {
    background: #009a3f !important;
  }
</style>
