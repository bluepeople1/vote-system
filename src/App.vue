<template>
  <div id="app">
    <div id="appContainer">
      <music-player></music-player>
      <router-view/>
    </div>
    <loading :isShow="loadingInfo.isShow" :content="loadingInfo.content"></loading>
  </div>
</template>

<script>
import loading from './components/common/Loading'
import MusicPlayer from './components/common/MusicPlayer'

export default {
  name: 'App',
  components: {
    loading, MusicPlayer
  },
  computed: {
    loadingInfo () {
      return this.$store.getters.loadingInfo
    }
  }
}
</script>

<style lang="less">
  * {
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    #appContainer {
      height: 100%;
    }
  }
</style>
