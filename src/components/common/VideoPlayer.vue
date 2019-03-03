<template>
  <video-player class="video-player-box vjs-big-play-centered"
                ref="videoPlayer"
                :options="playerOptions"
                :playsinline="true"
                customEventName="customstatechangedeventname"
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
                @ended="onPlayerEnded($event)"
                @waiting="onPlayerWaiting($event)"
                @playing="onPlayerPlaying($event)"
                @loadeddata="onPlayerLoadeddata($event)"
                @timeupdate="onPlayerTimeupdate($event)"
                @canplay="onPlayerCanplay($event)"
                @canplaythrough="onPlayerCanplaythrough($event)"
                @statechanged="playerStateChanged($event)"
                @ready="playerReadied">
  </video-player>
</template>

<script>
import '../../assets/css/custom-theme.css'
// // videojs
// import videojs from 'video.js'
// window.videojs = videojs
// // hls plugin for videojs6
// require('videojs-contrib-hls/dist/videojs-contrib-hls.js')
export default {
  name: 'VideoPlayers',
  props: {
    videoPath: String,
    poster: String
  },
  data () {
    return {
      playerOptions: {
        // height: '360',
        fluid: false,
        preload: 'auto',
        autoplay: false, // 播放器准备好之后，是否自动播放 【默认false】
        muted: false, // true/false 是否静音
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          // mp4
          src: this.videoPath
          // webm
          // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
        }],
        poster: this.poster
      }
    }
  },
  mounted () {
    // setTimeout(() => {
    //   console.log('dynamic change options', this.player)
    // }, 5000)
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    // listen event
    onPlayerPlay (player) {
      // console.log('player play!', player)
    },
    onPlayerPause (player) {
      // console.log('player pause!', player)
    },
    // ...player event
    // or listen state event
    playerStateChanged (playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },
    // player is ready
    playerReadied (player) {
      console.log('the player is readied', player)
      // player.currentTime(10)
      // you can use it to do something...
      // player.[methods]
    },
    onPlayerEnded (player) {

    },
    onPlayerWaiting (player) {

    },
    onPlayerPlaying (player) {

    },
    onPlayerLoadeddata (player) {

    },

    onPlayerTimeupdate (player) {
    },
    onPlayerCanplay (player) {
    },
    onPlayerCanplaythrough (player) {
    }
  }
}
</script>

<style lang="less">
  .video-js {
    width: 100% !important;
    height: 250px;
  }

  .vjs-big-play-button {
    font-size: 2.5em;
    line-height: 2.3em;
    height: 2.5em;
    width: 2.5em;
    -webkit-border-radius: 2.5em;
    -moz-border-radius: 2.5em;
    border-radius: 2.5em;
    background-color: #73859f;
    background-color: rgba(115, 133, 159, .5);
    border-width: 0.15em;
    margin-top: -1.25em;
    margin-left: -1.75em;
  }

  /* 中间的播放箭头 */
  .vjs-big-play-button .vjs-icon-placeholder {
    font-size: 1.63em;
  }

  /* 加载圆圈 */
  .vjs-loading-spinner {
    font-size: 2.5em;
    width: 2em;
    height: 2em;
    border-radius: 1em;
    margin-top: -1em;
    margin-left: -1.5em;
  }
</style>
