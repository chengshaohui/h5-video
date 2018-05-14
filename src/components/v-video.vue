<template>
  <div class="video-play-wrapper" ref="videoPlayWrapper">
    <!--video-->
    <div class="play-box" id="playBox">
      <!--<video-player :class="'vjs-big-play-centered'" id="video-player" :playsinline="true" ref="videoPlayer" :options="playerOptions"/>-->
      <video class="h5-video" @canplay="canplay" ref="videoH5" controls preload="auto" :playsinline="true"
             :x5-playsinline="true" :webkit-playsinline="true" :x5-video-player-fullscreen="true">
        <source :src="item.src" :type="item.type" v-for="item in playerOptions.sources" :key="item.src">
      </video>
    </div>
    <!--弹幕-->
    <div class="ad-box" ref="adBox">
      <div class="ad-box-left" @click="barrageFlag=!barrageFlag">
        弹幕-<span>{{barrageFlag?'开':'关'}}</span>
      </div>
      <div class="ad-box-right">
        <div class="accessNum">
          <img width="22" height="22" src="../assets/img/access-icon.png" alt="">
          <span class="num">{{accessNum}}</span>
        </div>
        <div class="commentNum">
          <img width="22" height="22" src="../assets/img/comment-icon.png" alt="">
          <span class="num">{{commentNum}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'v-video',
    data() {
      return {
        barrageFlag: false,
        accessNum: 0,
        commentNum: 0,
        adBoxH: 0,
        playerOptions: {
          vjsBigPlayCentered: 'center',
          preload: 'auto',
          muted: false,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: 'video/mp4',
            src: 'http://recordcdn-sz.qukanvideo.com/upload/vod/user1456371742481960/1525225522482964/2/video.mp4'
          }]
        }
      }
    },
    methods: {
      canplay(e) {
        let clientW = document.body.clientWidth
        let h = e.srcElement.videoHeight
        let w = e.srcElement.videoWidth
        let videoH = (h / w) * clientW + this.adBoxH
        this.$emit('canPlay', videoH)
      }
    },
    mounted() {
      /*
      let videoPlayer = this.$refs.videoPlayer.$el
      let video = videoPlayer.querySelector('.vjs-tech')
      let clientW = document.body.clientWidth
      video.addEventListener('canplay', function(e) {
        let h = this.videoHeight
        let w = this.videoWidth
        let videoH = (h / w) * clientW
        // 设置<video>父元素的高度
        videoPlayer.querySelector('.video-js').style.height = videoH + 'px'
      }, false)
      video.oncanplay = function(e) {
        console.log(111111)
      }
      // 设置行内播放
      video.setAttribute('playsinline', true)
      video.setAttribute('webkit-playsinline', true)
      video.setAttribute('x5-playsinline', true)
      */
      this.adBoxH = this.$refs.adBox.offsetHeight
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  #playBox {
    position: relative;
    font-size: 0;
    #video-player {
      /*position: absolute;*/
      width: 100%;
      /deep/ .video-js {
        width: 100%;
      }
      /deep/ .vjs-tech {
        width: 100%;
        height: auto;
      }
    }
    .h5-video {
      width: 100%;
      object-fit: cover;
    }
  }

  .ad-box {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;
    background-color: #313642;
    color: #94979f;
    .ad-box-left {
      border: 1px solid #94979f;
      border-radius: 20px;
      padding: 1px 4px 0;
      font-size: 11px;
    }
    .ad-box-right {
      display: flex;
      .accessNum {
        margin-right: 4px;
      }
      .accessNum,
      .commentNum {
        display: flex;
        justify-items: center;
        .num {
          line-height: 22px;
          padding: 0 2px;
        }
      }
    }
  }
</style>
