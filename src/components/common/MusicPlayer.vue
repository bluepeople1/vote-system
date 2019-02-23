<template>
  <div id="container">
    <div id="music-player">
      <audio id="player" :src="config.musicUrl" autoplay preload loop controls>
        <!--<source src="/static/audio/dream.mp3" type="audio/mpeg"/>-->
        Your browser does not support the audio element.
      </audio>
      <div id="player-ctrl">
        <img id="music" :class="isPlay ? 'play' : 'pause'" src="../../assets/img/music.png" alt="" @click="playerCtrl">
      </div>
    </div>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import apiService from '@/api/Service'

  export default {
    name: 'MusicPlayer',
    data(){
      return {
        musicUrl:'https://www.hzrtpxt.top/shaonianqiang.mp3'
      }
    },
    mounted () {
      let audio = document.getElementById('player')
      wx.ready(function () {
        audio.play()
      })
    },
    methods: {
      /**
       * 音乐播放控制播放暂停
       */
      playerCtrl () {
        let _this = this
        let audio = document.getElementById('player')
        wx.ready(function () {
          if (!_this.isPlay) {
            audio.play()
          } else {
            audio.pause()
          }
        })
        this.$store.dispatch('playOrPausePlayer')
      }
    },
    computed: {
      isPlay () {
        return this.$store.getters.isPlay
      },
      config () {
        return this.$store.getters.config
      }
    }
  }
</script>

<style scoped lang="less">
  #container {
    position: fixed;
    top: 15px;
    right: 50px;
    z-index: 2000;
    #music-player {
      audio {
        display: none;
      }
      #player-ctrl {
        position: absolute;
        #music {
          width: 45px;
          height: 45px;
        }
      }
    }
  }

  @keyframes rotate-music {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /*动画开始*/
  .play {
    animation: rotate-music 2s linear infinite;
  }

  /*动画重新开始*/
  .restart {
    animation: rotate-music 2s linear infinite;
  }

  /*动画暂停*/
  .pause {
    animation-play-state: paused;
  }

</style>
