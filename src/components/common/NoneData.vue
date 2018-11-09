<template>
    <div>
      <img :src="noData" alt="暂无数据">
    </div>
</template>

<script>
  export default {
    name: 'NoneData',
    data () {
      return {
        noData:require('../../assets/img/icon-no-data.svg')
      }
    }
  }
</script>

<style scoped>

</style>
