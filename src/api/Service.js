//毛
// const prefix = 'http://www.yaqinkeji.top/'
// 黄
const prefix = 'http://www.hzrtpxt.top/'
const host = prefix + 'homeschool/wxInterface/';
const wxPayUrl = prefix + 'homeschool/wxPay/userPay';

export default {
  /**
   * 1、查询当前活动信息
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getActiityInfo: (vm, data) => vm.axios.get(host + 'wxSelectActivityInfo', {params: data}),

  /**
   * 2、查询当前活动首页轮播图片
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getActivitySlideshow: (vm, data) => vm.axios.get(host + 'wxSelectActivityHeadImg', {params: data}),

  /**
   * 3、查询当前活动内容图片
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getActivityContentImg: (vm, data) => vm.axios.get(host + 'wxSelectActivityContentImg', {params: data}),

  /**
   * 4、查询当前活动学生（模糊查询复用）（排行榜复用-paze:0 -pazeSize:15）
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getActivityStudents: (vm, data) => vm.axios.get(host + 'wxSelectStudetByLikeName', {params: data}),

  /**
   * 5、点击进入学生详情-查询学生所有照片
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getStuDetailImg: (vm, data) => vm.axios.get(host + 'wxSelectStudetImg', {params: data}),

  /**
   * 6、点击进入学生详情-查询学生基本信息
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getStuDetailInfo: (vm, data) => vm.axios.get(host + 'wxSelectStudetInfo', {params: data}),

  /**
   * 7、学生详情-投票记录
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getStuDetailVoteRecord: (vm, data) => vm.axios.get(host + 'wxSelectStudetVotingInfo', {params: data}),
  /**
   * 8、学生详情-刷礼物详情
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getStuGiftDetail: (vm, data) => vm.axios.get(host + 'wxSelectStudentToGiftInfo', {params: data}),
  /**
   * 9、查询当前活动奖品
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getActivityPrize: (vm, data) => vm.axios.get(host + 'wxSelectActivityPrize', {params: data}),
  /**
   * 10、查询所有礼物
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getGiftList: (vm, data) => vm.axios.get(host + 'wxSelectGift', {params: data}),
  /**
   * 11、微信点击投票
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  vote: (vm, data) => vm.axios.get(host + 'wxInsertVoting', {params: data}),
  /**
   * 12、刷礼物或者刷票后当前选手排名的更新以及票数
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getRefreshData: (vm, data) => vm.axios.get(host + 'wxSelectStudetInfoRanking', {params: data}),
  /**
   * 13、调用access_token和jsapi_ticket  -分享用到
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getTokenAndTicket: (vm, data) => vm.axios.get(host + 'wxGetToken', {params: data}),
  /**
   * 14、刷礼物-微信支付
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  wxPay: (vm, data) => vm.axios.get(wxPayUrl, {params: data}),
  /**
   * 17、查询活动视频  （学生视频复用）
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getActivityVideo: (vm, data) => vm.axios.get(host + 'wxSelectActivityAndStudentVideo', {params: data}),

  /**
   * 18、查询活动音乐
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  getActivityMusic: (vm, data) => vm.axios.get(host + 'selectActivityMusicWx', {params: data}),
  /**
   * 19、报名
   * @param vm
   * @param data
   * @returns {*|AxiosPromise<any>}
   */
  register: (vm, data) => vm.axios.post(host + 'wxToAddStudent', data),
  /**
   * 20、获取阿里云上传视频的凭证
   * @param vm
   * @returns {*|AxiosPromise<any>}
   */
  getAliyunVideoId: (vm) => vm.axios.get(host + 'getAliyunVedioId')

};


