<template>
  <!--详情页-->
  <div id="main">
    <div style="margin: 55px 15px;">
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
                  <div class="weui-uploader__info">{{imageUrls.length}}/{{images.length}}</div>
                </div>
                <div class="weui-uploader__bd">
                  <ul class="weui-uploader__files" ref="uploaderFiles">
                    <li v-for="(item, index) in images"
                        :key="index"
                        v-if="images && images.length">
                      <img class="weui-uploader__file" :src="item">
                      <img @click="deleteImg(index)" class="delete" src="../assets/img/delete.png">
                    </li>
                    <li v-if="images.length < 9" class="selectImg">
                      <div class="weui-uploader__input-box">
                        <div id="uploaderInput" class="weui-uploader__input"></div>
                      </div>
                      <input type="file" accept="image/*" id="imgUpload" @change="imageChange($event)">
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="upload">
          <my-player style="margin: 15px;" v-if="videoUrl !== ''" :videoPath="videoUrl"/>
          <div class="selectVideo" v-if="videoUrl === ''">
            <div class="uploadVideoBtn">
              <img src="../assets/img/upload_video.png">
              <input type="file" accept="video/mp4" id="fileUpload" @change="fileChange($event)">
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
        <div class="flex-grow marT35" @click="signUp">
          <a class="weui-btn weui-btn_primary flex-grow">立即报名</a>
        </div>
      </div>
    </div>

    <div class="marTop30">
      <div class="weui-flex">
        <div class="weui-flex__item">
          <hr class="line">
        </div>
        <div class="weui-flex__item">
          <div class="placeholder">活动详情</div>
        </div>
        <div class="weui-flex__item">
          <hr class="line">
        </div>
      </div>
    </div>
    <div class="marTop30" v-if="isShowImgList" style="margin-bottom: 55px">
      <ul>
        <li v-for="(it,idx) in imgList" :key="idx">
          <my-img :imageSrc="it" errorType="img"/>
        </li>
      </ul>
    </div>
    <my-dialog :title="title" :content="content" :display="dialog" v-on:dialogListener="dialogListener"/>
  </div>
</template>

<script>

import apiService from '@/api/Service'
import Dialog from './common/Dialog'
import {signs} from '@/assets/js/sign'
import VideoPlayer from './common/VideoPlayer'
import ImageError from './common/ImageError'

export default {
  components: {
    'my-dialog': Dialog,
    'my-player': VideoPlayer,
    'my-img': ImageError
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
      openId: this.$route.params.openId,
      loginId: this.$route.params.loginId,
      activityId: this.$route.params.activityId,
      images: [],
      videos: [],
      region: 'cn-shanghai',
      preViewVideoUrl: '',
      imageUrls: [],
      imageFiles: [],
      imgList: []
    }
  },
  created () {
    let params = {
      loginId: this.loginId,
      activityId: this.activityId
    }
    this.getCurrentActivityPropaganda(this, params).then(res => {
      console.log(res)
      this.imgList = res.resultObject.contentImgUrl
    })
  },
  methods: {
    /**
     * 获取当前活动首页宣传图
     * @param that
     * @param params
     * @response resultNumber 0:成功 非0:失败
     * @response resultMsg 结果消息
     * @response resultObject.contentImgUrl 图片路径
     */
    getCurrentActivityPropaganda (that, params) {
      return new Promise(function (resolve, reject) {
        apiService.getActivityContentImg(that, params).then(success => {
          return resolve(success)
        }, err => {
          return reject(err)
        })
      })
    },
    signUp () {
      if (this.file) {
        this.authUpload()
      } else {
        this.sign()
      }
    },
    deleteImg (index) {
      this.images.splice(index, 1)
      this.imageUrls.splice(index, 1)
    },
    /**
     * 重置视频选择状态
     */
    reSelect () {
      this.statusText = '您可以重新选择一个视频~'
      this.preViewVideoUrl = ''
    },
    /**
     * 选择图片
     * @param e
     */
    imageChange (e) {
      let file = e.target.files[0]
      this.images.push(URL.createObjectURL(file))
      this.imageFiles.push(file)
      let client = new OSS.Wrapper({
        region: this.config.oss.region,
        accessKeyId: this.config.oss.accessKeyId,
        accessKeySecret: this.config.oss.accessKeySecret,
        bucket: this.config.oss.bucket
      })
      try {
        client.put((new Date()).valueOf() + '-' + file.name, file).then(result => {
          this.imageUrls.push(result.url)
        })
      } catch (er) {
        console.log(er)
      }
    },
    /**
     * 选择视频
     * @param e
     */
    fileChange (e) {
      this.file = e.target.files[0]
      this.preViewVideoUrl = URL.createObjectURL(e.target.files[0])
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
      this.uploader.addFile(this.file, null, null, null, userData)
      this.uploadDisabled = false
      this.pauseDisabled = true
      this.resumeDisabled = true
    },
    // 上传
    authUpload () {
      this.$store.dispatch('loading', {
        isShow: true,
        content: '正在上传视频...'
      })
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
        userId: self.config.userId, // 阿里云账号ID
        // 添加文件成功
        addFileSuccess: function (uploadInfo) {
          self.uploadDisabled = false
          self.resumeDisabled = false
          // self.statusText = '添加文件成功, 等待上传...'
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
          self.$store.dispatch('hideLoading')
          self.sign(uploadInfo.videoId)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
        },
        // 取消文件上传
        onUploadCanceled: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function (uploadInfo, totalSize, progress) {
          self.authProgress = Math.ceil(progress * 100)
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
          self.statusText = '文件上传完毕'
        }
      })
      return uploader
    },
    //判断是什么设备打开的网页
    isIosDevice () {
      return navigator.appVersion.includes('iPhone')
    },
    //dialog 的监听方法
    dialogListener: function (data) {
      this.dialog = data.hide
      this.toIndex()
    },
    toIndex: function () {
      this.$router.push({
        name: 'Index',
        params: {
          loginId: this.config.loginId,
          activityId: this.config.activityId,
          openId: this.config.openId,
          nickName: this.config.nickName,
          headImgUrl: this.config.headImgUrl
        }
      })
    },
    /**
     * 信息提示
     */
    showTip (msg) {
      [this.title, this.content, this.dialog] = msg
    },
    //报名方法
    sign (videoId) {
      if (!this.userName) {
        this.showTip(['错误提示', '请填写参赛选手姓名~', 'block'])
        return
      }
      if (!this.contact) {
        this.showTip(['错误提示', '请填写联系方式~', 'block'])
        return
      }
      if (!(this.imageUrls && this.imageUrls.length)) {
        if (this.images.length - this.imageUrls.length) {
          this.showTip(['错误提示', '图片正在上传，请稍后再试~', 'block'])
          return
        } else {
          this.showTip(['错误提示', '请至少选择一张图片~', 'block'])
          return
        }
      }
      apiService.register(this, {
        openId: this.openId,
        loginId: this.loginId,
        activityId: this.activityId,
        studentName: this.userName,
        tel: this.contact,
        ImageId: this.imageUrls,
        videoId: videoId ? [videoId] : []
      }).then(success => {
        if (success.resultNumber === '0') {
          this.reset()
          this.showTip(['报名成功', success.message, 'block'])
        } else {
          this.showTip(['错误提示', '发生未知错误，请联系管理员，给您带来不便请谅解', 'block'])
        }
      }).catch(err => {
        this.showTip(['错误提示', '发生未知错误，请联系管理员，给您带来不便请谅解', 'block'])
      })
    },
    /**
     * 批量上传图片
     */
    batchUploadImage (callbackToRegister) {
      let client = new OSS.Wrapper({
        region: this.config.oss.region,
        accessKeyId: this.config.oss.accessKeyId,
        accessKeySecret: this.config.oss.accessKeySecret,
        bucket: this.config.oss.bucket
      })
      this.$store.dispatch('loading', {
        isShow: true,
        content: '正在上传图片...'
      })
      let count = this.imageFiles.length
      for (let img of this.imageFiles) {
        try {
          client.put((new Date()).valueOf() + '-' + img.name, img).then(result => {
            this.imageUrls.push(result.url)
            count--
            if (!count) {
              callbackToRegister()
            }
          })
        } catch (er) {
          console.log(er)
        }
      }
    },
    /**
     * 重置页面
     */
    reset () {
      this.$store.dispatch('hideLoading')
      this.$store.dispatch('config', new Map().set('studentCode', 1))
      this.preViewVideoUrl = ''
      this.images.length = 0
      this.imageUrls.length = 0
      this.userName = ''
      this.contact = ''
    }
  },
  computed: {
    /**
     * 是否展示图片列表
     */
    isShowImgList () {
      return this.imgList.length !== 0
    },
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
    .weui-uploader__files {
      .selectImg {
        input {
          position: absolute;
          width: 77px;
          height: 77px;
          opacity: 0;
          z-index: 2;
        }
      }
      .delete {
        position: absolute;
        width: 16px;
        height: 16px;
        right: 4px;
      }
    }
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
      position: relative;
    }
  }

</style>
