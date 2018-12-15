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
              <label class="weui-label">年龄</label>
            </div>
            <div class="weui-cell__hd">
              <input class="weui-input" type="number" v-model="userAge" pattern="[0-9]*" placeholder="请输入你的年龄">
            </div>
          </div>
          <div class="weui-cell">
            <div class="weui-cell__hd">
              <label class="weui-label">性别</label>
            </div>
            <div class="weui-cell__hd" style="width:  100%;">
              <div class="weui-cell weui-cell_select">
                <div class="weui-cell__bd">
                  <select class="weui-select" name="select1" v-model="userSex">
                    <option selected value="1">男</option>
                    <option value="2">女</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="weui-gallery" id="gallery">
          <span class="weui-gallery__img" id="galleryImg"></span>
          <div class="weui-gallery__opr">
            <a href="javascript:" class="weui-gallery__del">
              <i @click="deleteImg" class="weui-icon-delete weui-icon_gallery-delete"></i>
            </a>
          </div>
        </div>
        <div class="weui-cells weui-cells_form">
          <div class="weui-cell">
            <div class="weui-cell__bd">
              <div class="weui-uploader">
                <div class="weui-uploader__hd">
                  <label class="weui-label">图片上传</label>
                  <div class="weui-uploader__info">{{imgNum}}/1</div>

                  <!-- <p class="weui-uploader__title">图片上传</p>
                  <div class="weui-uploader__info">0/2</div> -->
                </div>
                <div class="weui-uploader__bd">
                  <ul class="weui-uploader__files" id="uploaderFiles">
                    <!-- <li @click="fadeIn()" class="weui-uploader__file weui-uploader__file_status" style="background-image:url(./images/pic_160.png)">
                        <div class="weui-uploader__file-content">
                            <i class="weui-icon-warn"></i>
                        </div>
                    </li>
                    <li class="weui-uploader__file weui-uploader__file_status" style="background-image:url(./images/pic_160.png)">
                        <div class="weui-uploader__file-content">50%</div>
                    </li> -->
                  </ul>
                  <div class="weui-uploader__input-box">
                    <div id="uploaderInput" @click="selectImg()" class="weui-uploader__input"></div>
                    <!--<input id="uploaderInput" @change="upload" class="weui-uploader__input" type="file" accept="image/*" multiple/>-->
                  </div>
                </div>
              </div>
            </div>
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

  import { getJsApiTicket, login, sign } from '@/api/Service'
  import Dialog from './common/Dialog'
  import wx from 'weixin-js-sdk'
  import { signs } from '@/assets/js/sign'

  export default {
    components: {
      'my-dialog': Dialog
    },
    data () {
      return {
        userName: '',
        userSex: 1,
        userAge: '',
        title: '', //dialog title 信息
        content: '', //dialog 显示提示内容
        dialog: 'none',
        userImg: '',
        imgNum: 0,
        localId: 0,
        localIds: '',
        access_token: ''
      }
    },
    created: function () {
      let that = this
      getJsApiTicket(function (res) {
        that.access_token = res.data.access_token
        const config = signs(res.data.jsapi_ticket, window.location.href.split('#')[0])
        wx.config({
          debug: false,
          appId: this.config._appId,
          timestamp: config.timestamp,
          nonceStr: config.noncestr,
          signature: config.signature,
          jsApiList: [
            'chooseImage',
            'previewImage',
            'uploadImage'
          ]
        })
      })
    },
    mounted () {
      let that = this
      let $gallery = $('#gallery'),
        $galleryImg = $('#galleryImg'),
        $uploaderFiles = $('#uploaderFiles')
      $uploaderFiles.on('click', 'li', function () {
        if (that.isIosDevice()) {
          wx.getLocalImgData({
            localId: that.localIds[0], // 图片的localID
            success: function (res) {
              $galleryImg.html(`<img src="${res.localData}" class="previewImg" />`)
            }
          })
        } else {
          $galleryImg.html(`<img src="${that.localIds}" class="previewImg" />`)
        }

        $galleryImg.attr('style', this.getAttribute('style'))
        $gallery.fadeIn(100)
      })
      $gallery.on('click', function () {
        $gallery.fadeOut(100)
      })
    },
    methods: {
      //判断是什么设备打开的网页
      isIosDevice: function () {
        if (navigator.appVersion.includes('iPhone')) {
          console.log('iPhone')
          return true
        } else if (navigator.appVersion.includes('Android')) {
          console.log('Android')
          return false
        }
      },
      //适配ios设备localId展示图片
      getLocalImgData (localId) {
        let that = this
        wx.getLocalImgData({
          localId: localId, // 图片的localID
          success: function (res) {
            let localData = res.localData // localData是图片的base64数据，可以用img标签显示
            let tmpl = `<li><img class="weui-uploader__file" src="${localData}"></li>`
            $('#uploaderFiles').html(tmpl)
            that.imgNum = 1
          }
        })
      },
      //上传图片
      uploadImg (localIds) {
        let that = this
        wx.uploadImage({
          localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1,// 默认为1，显示进度提示
          success: function (res) {
            //let serverId = res.serverId; // 返回图片的服务器端ID
            that.userImg = res.serverId
          }
        })
      },
      //选择图片
      selectImg () {
        let that = this
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            that.localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            that.uploadImg(res.localIds)
            if (that.isIosDevice()) {
              that.getLocalImgData(res.localIds[0])
            } else {
              let tmpl = `<li><img class="weui-uploader__file" src="${res.localIds[0]}"></li>`
              $('#uploaderFiles').html(tmpl)
              that.imgNum = 1
            }
          }
        })
      },
      //删除选中图片
      deleteImg () {
        $('#uploaderFiles')
          .children('li')
          .remove()
        this.localIds = ''
        this.imgNum = 0
        this.userImg = ''
      },
      //dialog 的监听方法
      dialogListener: function (data) {
        this.dialog = data.hide
      },
      toIndex: function () {
        this.$router.push('/index')
      },
      //上传图片
      upload: function (e) {
        const that = this
        let tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>'
        let src,
          url = window.URL || window.webkitURL || window.mozURL,
          files = e.target.files
        if (that.imgNum !== 0) {
          that.title = '提示'
          that.content = '只能上传一张图片'
          that.dialog = 'block' //显示dialog
          return
        }
        for (let i = 0, len = files.length; i < len; ++i) {
          let file = files[i]
          // console.log('file', file);
          let fileMaxSize = 1024 * 1024
          // console.log('file', file.size / fileMaxSize);
          if ((file.size / fileMaxSize) > 20) {
            that.title = '提示'
            that.content = '图片大小不能超过5M'
            that.dialog = 'block' //显示dialog
            return
          }
          if (url) {
            src = url.createObjectURL(file)
          } else {
            src = e.target.result
          }
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            //就是base64
            that.userImg = this.result.split(',')[1]
          }
          $('#uploaderFiles').append($(tmpl.replace('#url#', src)))
          that.imgNum = 1
        }
      },
      //报名方法
      sign: function () {
        let that = this
        if (!this.userName) {
          this.title = '错误提示'
          this.content = '请填写参赛选手姓名'
          this.dialog = 'block' //显示dialog
          return
        }
        if (!this.userAge) {
          this.title = '错误提示'
          this.content = '请填写参赛选手年龄'
          this.dialog = 'block' //显示dialog
          return
        }
        if (!this.userImg) {
          this.title = '错误提示'
          this.content = '请选择一张参赛选手图片'
          this.dialog = 'block' //显示dialog
          return
        }
        if (!this.userSex) {
          this.title = '错误提示'
          this.content = '请填写参赛选手性别'
          this.dialog = 'block' //显示dialog
          return
        }

        //请求参数
        let params = {
          studentName: this.userName,
          studentImg: this.userImg,
          studentAge: this.userAge,
          studentContext: this.userSex,
          studentTicket: 0,
          activityId: sessionStorage.getItem('activityId')
        }
        // console.log(params);
        //报名接口
        sign(params, res => {
          // console.log('报名返回', res);
          if (res.data === 1) {
            that.deleteImg()
            that.userName = ''
            that.userAge = ''
            this.title = '报名成功'
            this.content = '您已成功参加活动'
            this.dialog = 'block' //显示dialog
          }
        })
      }
    },
    computed: {
      config () {
        return this.$store.getters.config
      }
    }
  }
</script>

<style scoped>
  .previewImg {
    width: 80%;
    height: auto;
    margin: auto;
  }

  #main {
    background: #ecf0f5;
    min-height: 100vh;
    font-size: 14px;
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

  ul {
    list-style: none;
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
    margin-bottom: 0px !important;
    margin-right: 0px !important;
  }

  .weui-gallery {
    z-index: 10000000 !important;
  }
</style>
