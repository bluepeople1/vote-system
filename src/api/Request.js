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
export const post = (path, params, callback) => {
  axios.post(config.request_ip + path, params).then(res => {
    callback(res);
  }).catch(err => {
    callback(err);
  });
};
