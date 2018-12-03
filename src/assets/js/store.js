// noinspection JSAnnotator
const store = {
  debug: true,
  base_url: 'https://www.hzrtpxt.top/nserver',
  img_url: 'https://www.hzrtpxt.top',
  wxUserInfo:{},
  state: {
    appId: 'wxb36f7c6095549952',
    uuid: '',
    openId: '',
    sessionId: '',
    jsApiTicket: '',
    sharedUrl: '',
    sharedImg: '',
    activity: {}
  },
  /**
   * 微信用户信息
   * @param wxUserInfo
   */
  setWxUserInfo(wxUserInfo){
    this.wxUserInfo=wxUserInfo;
    sessionStorage.setItem('wxUserInfo', JSON.stringify(wxUserInfo));
  },
  setActivity: function (activity) {
    this.state.activity = activity;
    sessionStorage.setItem('activity', JSON.stringify(activity));
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
  },
  /**
   * 计算时间差
   * @param beginTime 开始时间戳
   * @param endTime  结束时间戳
   */
  calTimeDiff (beginTime, endTime) {
    return beginTime - endTime;
  },
  /**
   * 判断活动时间是否结束
   * @param nowTime  当前时间戳
   * @param endTime  结束时间戳
   * @returns {boolean}  true代表结束   false代表未结束
   */
  isActivityEnd (nowTime, endTime) {
    //当前时间减去结束时间，如果大于0，表示已结束
    if (this.calTimeDiff(nowTime, endTime) >= 0)
      return true;
    return false;
  },
  /**
   * 判断活动时间是否还未开始
   * @param nowTime  当前时间戳
   * @param beginTime  结束时间戳
   * @returns {boolean}  true代表活动还未开始   false代表活动已经开始
   */
  isActivityNotBegin (nowTime, beginTime) {
    //当前时间减去开始时间，如果小于0，代表活动还未开始
    if (this.calTimeDiff(nowTime, beginTime) <= 0)
      return true;
    return false;
  }

};

export default store;
