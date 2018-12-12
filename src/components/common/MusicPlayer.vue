<template>
  <div id="container">
    <div id="music-player">
      <audio controls="controls" autoplay="autoplay" loop="loop">
        <source src="/static/audio/dream.mp3" type="audio/mpeg"/>
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MusicPlayer',
    data () {
      return {}
    },
    created () {
    },
    mounted () {
      // let audio = document.getElementsByTagName('audio')
      // if (this.isPlay && audio.paused) {
      //   audio.play()
      // }

    },
    computed: {
      isPlay () {
        return this.$store.getters.isPlay
      }
    }
  }
</script>

<style scoped>

</style>
