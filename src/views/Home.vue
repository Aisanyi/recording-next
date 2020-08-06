<template>
  <div class="home">
    <div class="nav">
      <span :class="{ active: !data.desktop }" @click="madioUser">录像</span>
      <span :class="{ active: data.desktop }" @click="madioDesktop">录屏</span>
    </div>
    <video ref="video"></video>
    <div class="btn" v-if="!data.recordEnd" @click="recording">{{ data.isRecord ? '录制中' : '录制' }}</div>
    <div class="btn play" v-if="data.recordEnd" @click="play">播放</div>
    <div class="btn down" v-if="data.recordEnd" @click="down">下载</div>
    <div class="btn init" v-if="data.recordEnd" @click="init">重新录制</div>
  </div>
</template>

<script>
// @ is an alias to /src
import { reactive, ref } from 'vue'
import Madio from '../medio/index'
export default {
  name: 'Home',
  setup() {
    const video = ref(null)
    let data = reactive({
      isRecord: false,
      recordEnd: false,
      desktop: false
    })

    let madio = new Madio(video)
    let videoConfig = {
      audio: true,
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 }
      }
    }
    madio.create(videoConfig)
    function recording() {
      data.isRecord = !data.isRecord
      if (data.isRecord) {
        // 开始录制
        madio.start()
      } else {
        // 结束录制
        data.recordEnd = true
        madio.stop()
      }
    }
    function play() {
      madio.play()
    }
    function down() {
      madio.down()
    }
    function init() {
      data.recordEnd = false
      madio.init(videoConfig)
    }
    function madioUser() {
      if (!data.desktop | data.recordEnd) return
      data.desktop = false
      videoConfig = {
        audio: true,
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        }
      }
      madio.create(videoConfig)
    }
    function madioDesktop() {
      if (data.desktop | data.recordEnd) return
      data.desktop = true
      videoConfig = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        }
      }
      madio.create(videoConfig)
    }
    return {
      data,
      recording,
      video,
      play,
      down,
      init,
      madioUser,
      madioDesktop
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  video {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .nav {
    width: 200px;
    line-height: 30px;
    font-size: 16px;
    color: #fff;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 9;
    span {
      margin-right: 20px;
      cursor: pointer;
      user-select: none;
      &.active {
        color: red;
      }
    }
  }
  .btn {
    width: 80px;
    height: 80px;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 40px;
    border-radius: 50%;
    cursor: pointer;
    line-height: 80px;
    text-align: center;
    user-select: none;
    color: #fff;
  }
  .down {
    transform: translateX(80px);
  }
  .play {
    transform: translateX(-160px);
  }
}
</style>
