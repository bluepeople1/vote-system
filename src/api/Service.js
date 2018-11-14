import $http from 'axios';
import { post, get } from './Request';
let qs= require('qs');

//-----------Begin----------------
//---通用接口 简单的post、get请求---
//-----------Begin----------------

/**
 * 获取用户列表
 * @param {回调函数} callback
 */
export const getUserList = (callback) => {
  get('/userList', res => {
    callback(res);
  });
};

/**
 * 根据用户id获取用户信息
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const getUserInfoById = (params, callback) => {
  post(path, params, res => {
    console.log(res);
  });
};

/**
 * 微信授权
 * @param {*} callback
 */
export const wxAuth = (callback) => {
  // axios.get("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx339df95d83b73048&redirect_uri=https%3A%2F%2F4e6d1030.ngrok.io%2Flxsj%2Fwechat%2Fsecurity&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect").then(res => {
  //     callback('service',res);
  // }).catch(err => {
  //     callback(err);
  // })
  post('/wxAuth', {}, res => {
    callback(res);
  });
};

/**
 * 投票
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const vote = (params, callback) => {
  post('/vote', params, res => {
    callback(res);
  });
};

/**
 * 搜索
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const search = (params, callback) => {
  post('/search', params, res => {
    callback(res);
  });
};

/**
 * 访问量
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const pv = (params, callback) => {
  post('/pv', params, res => {
    console.log(res);
    callback(res);
  });
};
/**
 * 登录
 * @param {回调函数} callback
 */
export const login = (callback) => {
  get('/login', res => {
    callback(res);
  });
};

/**
 * 获取学生列表
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const getStudentList = (params, callback) => {
  post('/getStudentList', params, res => {
    callback(res);
  });
};
/**
 * 获取活动信息
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const getActivityInfo = (params, callback) => {
  post('/getActivityInfo', params, res => {
    callback(res);
  });
};

/**
 * 获取参赛选手信息和活动信息
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const getStuAndAct = (params, callback) => {
  post('/getStuAndAct', params, res => {
    callback(res);
  });
};

/**
 * 获取参赛选手排行榜
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const getRankingList = (params, callback) => {
  post('/rank', params, res => {
    callback(res);
  });
};

/**
 * 选手报名
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const sign = (params, callback) => {
  post('/sign', params, res => {
    callback(res);
  });
};
/**
 * 礼物列表
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const getGiftList = (callback) => {
  get('/getGiftList', res => {
    callback(res);
  });
};

/**
 * 奖品
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const getPrizeList = (params, callback) => {
  post('/prize', params, res => {
    callback(res);
  });
};

/**
 * 活动图片
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const getActivityImg = (params, callback) => {
  post('/activityImg', params, res => {
    callback(res);
  });
};

/**
 * 微信支付
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const wxpay = (params, callback) => {
  post('/sendGift', params, res => {
    callback(res);
  });
};

export const getJsApiTicket = (callback) => {
  get('/getTicket', res => {
    callback(res);
  });
};

//-----------End------------------
//---通用接口 简单的post、get请求---
//-----------End------------------

