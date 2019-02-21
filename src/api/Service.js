
let qs = require('qs');
let url = 'http://www.yaqinkeji.top';

export default {
  getActivityInfo: (vm, data) => vm.axios.get('model/get', {params: data}),

}


