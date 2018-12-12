<template>
  <div id="app">

    <div id="appContainer">
      <music-player></music-player>
      <router-view/>
    </div>
    <loading :isShow="isShowLoading"></loading>
  </div>
</template>

<script>
  import loading from './components/common/Loading'
  import MusicPlayer from './components/common/MusicPlayer'
  export default {
    name: 'App',
    components:{
      loading,MusicPlayer
    },
    computed:{
      isShowLoading(){
        return this.$store.getters.isShowLoading
      }
    }
  }
</script>

<style lang="less">

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*width: 100vw;*/
    /*height: 100vh;*/
    min-height: 100vh;
    /*overflow: auto;*/
    background: #ecf0f5;

  }
</style>
