// noinspection JSAnnotator
const store = {
  debug: true,
  base_url:'https://www.hzrtpxt.top/nserver',
  img_url:'https://www.hzrtpxt.top',
  state: {
    appId: "wxb36f7c6095549952",
    uuid: '',
    openId: '',
    sessionId: '',
    jsApiTicket: '',
    sharedUrl: '',
    sharedImg:'',
    activity: {}
  },
  setActivity: function (activity) {
    this.state.activity = activity;
  },
  setUuid: function (uuid) {
    this.state.uuid = uuid;
    sessionStorage.setItem('uuid', uuid);
  },
  setOpenId: function (openId) {
    this.state.openId = openId;
    sessionStorage.setItem('openId', openId);
  },
  setSessionId: function (sessionId) {
    this.state.sessionId = sessionId;
    sessionStorage.setItem('sessionId', sessionId);
  },
  setJsApiTicket: function (jsApiTicket) {
    this.state.jsApiTicket = jsApiTicket;
    sessionStorage.setItem('jsApiTicket', jsApiTicket);
  },
  setSharedUrl: function (sharedUrl) {
    this.state.sharedUrl = sharedUrl;
    sessionStorage.setItem('sharedUrl', sharedUrl);
  },
  setSharedImg: function (sharedImg) {
  this.state.sharedImg = sharedImg;
  sessionStorage.setItem('sharedImg', sharedImg);
}

};

export default store;
