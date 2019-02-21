let host = 'http://www.yaqinkeji.top/homeschool/wxInterface/';

/**
 * get 请求
 * @param vm
 * @param path
 * @param data
 * @returns {*|AxiosPromise<any>}
 */
export const get = (vm, path , data) => vm.axios.get(host + path, {params: data})
