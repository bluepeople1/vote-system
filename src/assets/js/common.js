const CommonService = {
  /**
   * 获取地址栏?后的参数
   * @param name
   * @returns {*}
   */
  getQuery (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return decodeURIComponent((r[2]))
    }
    return null
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
    return this.calTimeDiff(nowTime, endTime) >= 0;

  },
  /**
   * 判断活动时间是否还未开始
   * @param nowTime  当前时间戳
   * @param beginTime  结束时间戳
   * @returns {boolean}  true代表活动还未开始   false代表活动已经开始
   */
  isActivityNotBegin (nowTime, beginTime) {
    //当前时间减去开始时间，如果小于0，代表活动还未开始
    return this.calTimeDiff(nowTime, beginTime) <= 0;

  }
}

export default CommonService
