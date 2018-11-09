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

export const jsapi_ticket = (callback) => {
  const ACCESS_TOKEN = '15_9jrKoJ9p1UHfDpbctoZD45Epc2GTcxJhTH2e8FVGn0g12EJN8bF0wgp9CpOpAen16wBQ6KALYKHK-MqVY5yx1EnGRUp7CCiA2kkn4kRwvvaFk6cKjtF49dqFKczoWVnwUnVegwt8gUjUR83QERZgAGAPCK';
  axios.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + ACCESS_TOKEN + '&type=jsapi').then(res => {
    callback(res);
  }).catch(err => {
    console.log(err);
  });
};
