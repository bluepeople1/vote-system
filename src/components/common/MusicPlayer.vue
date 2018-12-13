<template>
  <div id="container">
    <div id="music-player">
      <audio id="player" src="https://www.hzrtpxt.top/shaonianqiang.mp3" autoplay preload loop controls>
        <!--<source src="/static/audio/dream.mp3" type="audio/mpeg"/>-->
        Your browser does not support the audio element.
      </audio>
      <div id="player-ctrl">
        <img id="music" src="../../assets/img/music.png" alt="" @click="handle">
      </div>
    </div>
  </div>
</template>

<script>
  import wx from 'weixin-js-sdk'

  export default {
    name: 'MusicPlayer',
    data () {
      return {}
    },
    created () {
      // wx.config({
      //   debug: false,
      //   appId: '',
      //   timestamp: '',
      //   nonceStr: '',
      //   signature: '',
      //   jsApiList: []
      // })
    },
    mounted () {
      this.playerCtrl()
      this.animationCtrl()
    },
    methods: {
      /**
       * 动画控制开始暂停
       */
      animationCtrl(){
        let music= document.getElementById('music')
        if (!this.isPlay) {
          music.className='play'
        } else {
          music.className='pause'
        }
      },
      /**
       * 音乐播放控制播放暂停
       */
      playerCtrl(){
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
      },
      handle () {
        // this.$store.dispatch('playOrPausePlayer')
        this.playerCtrl()
        this.animationCtrl()
      }
    },
    computed: {
      isPlay () {
        return this.$store.getters.isPlay
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
