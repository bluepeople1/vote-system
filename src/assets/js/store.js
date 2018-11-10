// noinspection JSAnnotator
const store = {
  debug: true,
  state: {
    uuid: '',
    openId: '',
    sessionId: '',
    activity:{
      activityName:'',
      activityBeginTime:'',
      activityEndTime:''
    }
  },
  setActivity:function(activity){
    this.state.activity=activity;
  },
  setUuid:function (uuid) {
    this.state.uuid=uuid;
    sessionStorage.setItem("uuid", uuid);
  },
  setOpenId:function (openId) {
    console.log('这里执行了')
    this.state.openId=openId;
    sessionStorage.setItem("openId", openId);
  },
  setSessionId:function (sessionId) {
    this.state.sessionId=sessionId;
    sessionStorage.setItem("sessionId", sessionId);
  }

};

export default store;
