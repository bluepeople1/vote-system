<template>
  <!--详情页-->
  <div id="main">
    <div style="margin:15px;">
      <div class="page__bd marT10 marT35">
        <div class="weui-cells weui-cells_form">
          <div class="title">
            报名信息
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label">姓名</label>
            </div>
            <div class="weui-cell__hd">
              <input class="weui-input" type="text" v-model="userName" placeholder="请输入你的姓名">
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label">联系方式</label>
            </div>
            <div class="weui-cell__hd">
              <input class="weui-input"
                     type="number"
                     maxlength="11"
                     minlength="11"
                     v-model="contact"
                     pattern="[0-9]*"
                     placeholder="请输入您的手机号">
            </div>
          </div>
        </div>
        <div class="tip">*填写手机号是为了方便告知参赛及获奖信息</div>
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell">
            <div class="weui-cell__bd">
              <div class="weui-uploader">
                <div class="weui-uploader__hd">
                  <label class="weui-label">图片上传</label>
                  <div class="weui-uploader__info">{{images.length}}/9</div>
                </div>
                <div class="weui-uploader__bd">
                  <ul class="weui-uploader__files" ref="uploaderFiles">
                    <li v-for="(item, index) in images"
                        :key="index"
                        v-if="images && images.length">
                      <img class="weui-uploader__file" :src="item">
                    </li>
                    <li v-if="images.length < 9">
                      <div class="weui-uploader__input-box">
                        <div id="uploaderInput" @click="selectImg()" class="weui-uploader__input"></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="upload">
          <my-player v-if="videoUrl !== ''" :videoPath="videoUrl"/>
          <div class="selectVideo" v-if="videoUrl === ''">
            <div class="uploadVideoBtn">
              <img src="../assets/img/upload_video.png">
              <input type="file" id="fileUpload" @change="fileChange($event)">
            </div>
            <label class="status"><span>{{statusText}}</span></label>
          </div>
          <div class="upload-type" v-if="videoUrl !== ''">
            <div @click="reSelect">重新选择</div>
            <!--<button @click="authUpload" :disabled="uploadDisabled">开始上传</button>-->
            <!--<button @click="pauseUpload" :disabled="pauseDisabled">暂停</button>-->
            <!--<button :disabled="resumeDisabled" @click="resumeUpload">恢复上传</button>-->
            <!--<span class="progress">上传进度: <i id="auth-progress">{{authProgress}}</i> %</span>-->
          </div>
        </div>

        <div class="flex-grow marT15" @click="sign">
          <a class="weui-btn weui-btn_primary flex-grow">立即报名</a>
        </div>
      </div>
    </div>

    <!--底部-->
    <div id="footer">

    </div>
    <my-dialog :title="title" :content="content" :display="dialog" v-on:dialogListener="dialogListener"/>
  </div>
</template>

<script>

import apiService from '@/api/Service'
import Dialog from './common/Dialog'
import wx from 'weixin-js-sdk'
import {signs} from '@/assets/js/sign'
import VideoPlayer from './common/VideoPlayer'

export default {
  components: {
    'my-dialog': Dialog,
    'my-player': VideoPlayer
  },
  data () {
    return {
      file: null,
      authProgress: 0,
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      uploader: null,
      statusText: '您当前还没有选择视频~',
      userName: '',
      contact: '',
      title: '', //dialog title 信息
      content: '', //dialog 显示提示内容
      dialog: 'none',
      loginId: this.$route.params.loginId,
      activityId: this.$route.params.activityId,
      images: [],
      videos: [],
      aliyunUserId: '1767548054776104',
      region: 'cn-shanghai',
      preViewVideoUrl: ''
    }
  },
  methods: {
    reSelect () {
      this.statusText = '您可以重新选择一个视频~'
      this.preViewVideoUrl = ''
    },
    fileChange (e) {
      this.file = e.target.files[0]
      this.preViewVideoUrl = URL.createObjectURL(e.target.files[0])
      console.log(this.preViewVideoUrl)
      if (!this.file) {
        alert('请先选择需要上传的文件!')
        return
      }
      let userData = '{"Vod":{}}'
      if (this.uploader) {
        this.uploader.stopUpload()
        this.authProgress = 0
        this.statusText = ''
      }
      this.uploader = this.createUploader()
      console.log(userData)
      this.uploader.addFile(this.file, null, null, null, userData)
      this.uploadDisabled = false
      this.pauseDisabled = true
      this.resumeDisabled = true
    },
    authUpload () {
      // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        this.uploader.startUpload()
        this.uploadDisabled = true
        this.pauseDisabled = false
      }
    },
    // 暂停上传
    pauseUpload () {
      if (this.uploader !== null) {
        this.uploader.stopUpload()
        this.resumeDisabled = false
        this.pauseDisabled = true
      }
    },
    // 恢复上传
    resumeUpload () {
      if (this.uploader !== null) {
        this.uploader.startUpload()
        this.resumeDisabled = true
        this.pauseDisabled = false
      }
    },
    createUploader (type) {
      let self = this
      let uploader = new AliyunUpload.Vod({
        timeout: 60000, // 请求过期时间（构造参数 timeout, 默认 60000）
        partSize: 1048576, // 分片大小（构造参数 partSize, 默认 1048576）
        parallel: 5, // 上传分片数（构造参数 parallel, 默认 5）
        retryCount: 3, // 网络失败重试次数（构造参数 retryCount, 默认 3）
        retryDuration: 2, // 网络失败重试间隔（构造参数 retryDuration, 默认 2）
        region: self.region, // 配置项 region, 默认 cn-shanghai
        userId: self.aliyunUserId, // 阿里云账号ID
        // 添加文件成功
        addFileSuccess: function (uploadInfo) {
          self.uploadDisabled = false
          self.resumeDisabled = false
          self.statusText = '添加文件成功, 等待上传...'
          console.log('addFileSuccess: ' + uploadInfo.file.name)
        },
        // 开始上传
        onUploadstarted: function (uploadInfo) {
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          if (!uploadInfo.videoId) {
            apiService.getAliyunVideoId(self).then(success => {
              console.log(success)
              let uploadAuth = success.resultObject.UploadAuth
              let uploadAddress = success.resultObject.UploadAddress
              let videoId = success.resultObject.VideoId
              uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            })
            self.statusText = '文件开始上传...'
            console.log('onUploadStarted:' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
          }
          // else {
          //   // 如果videoId有值，根据videoId刷新上传凭证
          //   // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
          //   let refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
          //   axios.get(refreshUrl).then(({data}) => {
          //     let uploadAuth = data.UploadAuth
          //     let uploadAddress = data.UploadAddress
          //     let videoId = data.VideoId
          //     uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
          //   })
          // }
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          console.log(uploadInfo)
          console.log('onUploadSucceed: ' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
          self.statusText = '文件上传成功!'
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
          self.statusText = '文件上传失败!'
        },
        // 取消文件上传
        onUploadCanceled: function (uploadInfo, code, message) {
          console.log('Canceled file: ' + uploadInfo.file.name + ', code: ' + code + ', message:' + message)
          self.statusText = '文件已暂停上传'
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function (uploadInfo, totalSize, progress) {
          console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(progress * 100) + '%')
          self.authProgress = Math.ceil(progress * 100)
          self.statusText = '文件上传中...'
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          // let refreshUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
          // axios.get(refreshUrl).then(({data}) => {
          //   let uploadAuth = data.UploadAuth
          //   uploader.resumeUploadWithAuth(uploadAuth)
          //   console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
          // })
          self.statusText = '文件超时...'
        },
        // 全部文件上传结束
        onUploadEnd: function (uploadInfo) {
          console.log('onUploadEnd: uploaded all the files')
          self.statusText = '文件上传完毕'
        }
      })
      return uploader
    },
    //判断是什么设备打开的网页
    isIosDevice () {
      return navigator.appVersion.includes('iPhone')
    },
    //适配ios设备localId展示图片
    getLocalImgData (localId) {
      wx.getLocalImgData({
        localId: localId, // 图片的localID
        success: (res) => {
          let localData = res.localData
          if (localData.indexOf('data:image') !== 0) {
            //判断是否有这样的头部
            localData = 'data:image/jpeg;base64,' + localData
          }
          localData = localData.replace(/[\r|\n]/g, '').replace('data:image/jgp', 'data:image/jpeg')
          //第一个替换的是换行符，第二个替换的是图片类型，因为在IOS机上测试时看到它的图片类型时jgp，
          //这不知道时什么格式的图片，为了兼容其他设备就把它转为jpeg
          this.images.push(localData)
        }
      })
    },
    //上传图片
    uploadImg (localIds) {
      wx.uploadImage({
        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1,// 默认为1，显示进度提示
        success: (res) => {
          //let serverId = res.serverId; // 返回图片的服务器端ID
          this.userImg = res.serverId
        }
      })
    },
    //选择图片
    selectImg () {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          this.getLocalImgData(res.localIds[0])
        }
      })
    },
    //dialog 的监听方法
    dialogListener: function (data) {
      this.dialog = data.hide
    },
    toIndex: function () {
      this.$router.push('/index')
    },
    //报名方法
    sign: function () {
      if (!this.userName) {
        this.title = '错误提示'
        this.content = '请填写参赛选手姓名'
        this.dialog = 'block' //显示dialog
        return
      }
      if (!this.contact) {
        this.title = '错误提示'
        this.content = '请填写联系方式'
        this.dialog = 'block' //显示dialog
        return
      }
      if (!(this.images && this.images.length)) {
        this.title = '错误提示'
        this.content = '请至少选择一张参赛选手图片'
        this.dialog = 'block' //显示dialog
        return
      }

      apiService.register(this, {
        loginId: this.loginId,
        activityId: this.activityId,
        studentName: this.userName,
        tel: this.contact,
        ImageId: [],
        videoId: []
      }).then(success => {
        this.title = '报名成功'
        this.content = '您已成功参加活动'
        this.dialog = 'block' //显示dialog
      })
    },
    reset () {
      this.images.length = 0
      this.userName = ''
      this.contact = ''
    }
  },
  computed: {
    videoUrl () {
      return this.preViewVideoUrl
    },
    config () {
      return this.$store.getters.config
    }
  }
}
</script>

<style scoped lang="less">
  .previewImg {
    width: 80%;
    height: auto;
    margin: auto;
  }

  #main {
    background: #ecf0f5;
    min-height: 100vh;
    font-size: 14px;
    .tip {
      color: red;
    }
    .upload {
      overflow: hidden;
      background-color: #fff;
      width: 100%;
      .upload-type {
        margin-top: 25px;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 8px;
        div {
          height: 35px;
          background: #0bb20c;
          line-height: 35px;
          color: #ffffff;
          padding: 0 15px;
        }
      }
      .selectVideo {
        height: 250px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .uploadVideoBtn {
          display: flex;
          justify-content: center;
          align-items: center;
          #fileUpload {
            position: absolute;
            width: 64px;
            height: 64px;
            opacity: 0;
          }
        }
      }
    }
  }

  .activity-time {
    color: red;
    font-weight: bold;
  }

  .title {
    height: 35px;
    background: #3cb371;
    color: #fff;
    line-height: 35px;
  }

  .bg-white {
    background: #fff;
  }

  .block {
    display: block;
  }

  .flex {
    display: flex;
    border-bottom: 1px solid #ececec;
  }

  .dis-flex {
    display: flex;
  }

  .dis-flex-grow {
    flex-grow: 1;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .marL10 {
    margin-left: 10px;
  }

  .marR10 {
    margin-right: 10px;
  }

  .marT10 {
    margin-top: 10px;
  }

  .marT15 {
    margin-top: 15px;
  }

  .marT35 {
    margin-top: 35px;
  }

  #footer {
    width: 100%;
    height: 44px;
    color: #fff;
    position: fixed;
    bottom: 0px;
    margin: 0px;
  }

  #tab {
    display: flex;
    justify-content: center;
  }

  .tab-item {
    line-height: 44px;
  }

  /*.li-time {*/
  /*display: -webkit-inline-box;*/
  /*display: -ms-inline-flexbox;*/
  /*display: inline-flex;*/
  /*height: 35px;*/
  /*align-items: center;*/
  /*}*/

  /*搜索*/
  .inp {
    width: 100%;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
  }

  /*搜索框*/
  .input {
    height: 15px;
    background: #ffffff;
    border: 1px solid #ececec;
    border-radius: 3px;
    padding: 8px;
  }

  .label {
    width: 4em;
  }

  .weui-cells {
    font-size: 14px !important;
  }

  .weui-btn {
    font-size: 14px !important;
    margin: 0 15px;
  }

  .weui-select {
    padding-left: 0 !important;
    height: 25px !important;
    line-height: 25px !important;
  }

  .weui-uploader__bd {
    display: flex;
    margin-bottom: 0 !important;
    margin-right: 0 !important;
  }

  .weui-gallery {
    z-index: 10000000 !important;
  }

  ul {
    list-style: none;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    li {
      justify-content: flex-start;
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>
