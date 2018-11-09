import axios from 'axios';

const config = require('../../static/config');

/**
 * get请求
 * @param {请求接口路径} path
 * @param {回调函数} callback
 */
export const get = (path, callback) => {

  axios.get(config.request_ip + path).then(res => {
    callback(res);
  }).catch(err => {
    console.log(err);
  });
};
/**
 * Post请求
 * @param {请求接口路径} path
 * @param {请求参数} params
 * @param {回调函数} callback
 */
export const post = (path, params = {}, callback) => {
  axios.post(config.request_ip + path, params).then(res => {
    callback(res);
  }).catch(err => {
    callback(err);
  });
};

export const jsapi_ticket = () => {
  const ACCESS_TOKEN = '14_LcakykM4fy3izh7qpobvCr7Z8tXBIuxcVDI4yLfU0zjKF__3iCwG2ejDTLiW3I2WquwQSimp3cEImAbemDo2l-Ls70g1TDZgIuM15UohvW9VV-feQ3T0D-VIO40BOEhACAUHX';
  axios.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + ACCESS_TOKEN + '&type=jsapi').then(res => {
    callback(res);
  }).catch(err => {
    console.log(err);
  });
};
