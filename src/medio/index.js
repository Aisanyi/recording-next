export default class Medio {
  mediaRecorder = null
  chunks = []
  url = null
  constructor(videoDom) {
    this.videoDom = videoDom
  }
  // 创建录像
  create(videoConfig = {
    audio: true,
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 }
    }
  }) {
    navigator.mediaDevices.getUserMedia(videoConfig).then(stream => {
      this.videoDom.value.srcObject = stream
      this.videoDom.value.onloadedmetadata = () => {
        this.videoDom.value.play()
      }
      this.mediaRecorder = new MediaRecorder(stream)
      this.mediaRecorder.ondataavailable = e => {
        this.chunks.push(e.data)
      }
      this. mediaRecorder.onstop = () => {
        this.url = window.URL.createObjectURL(
          new Blob(this.chunks, {
            type: 'video/x-msvideo'
          })
        )
        this.videoDom.value.srcObject = null
        this.videoDom.value.src = this.url
        this.videoDom.value.onloadedmetadata = null
      }
    })
  }

  // 开始录制
  start() {
    this.mediaRecorder.start()
  }

  // 录制结束
  stop() {
    this.mediaRecorder.stop()
  }

  // 播放
  play() {
    this.videoDom.value.play()
  }

  // 重新开始录制
  init(videoConfig) {
    this.chunks = []
    this.create(videoConfig)
  }

  // 下载
  down() {
    let win = window.open(this.url)
    win.close()
  }

}