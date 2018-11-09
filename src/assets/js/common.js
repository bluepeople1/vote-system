/**
 * 图片加载失败
 */
export const errImg = function () {
  const img = event.srcElement
  img.src = 'this.src="' + require('../assets/img/errorImg.png') + '"'
  img.onerror = null//控制不要一直跳动
}



