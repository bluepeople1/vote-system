import Vue from 'vue'
import Router from 'vue-router'
import Container from '@/components/Container' //容器
Vue.use(Router)

/**
 * 首页
 * @type {{path: string, name: string, component, meta: {keepAlive: boolean}, beforeEnter: index.beforeEnter}}
 */
const index = {
  path: '/index/:loginId/:activityId/:openId/:nickName/:headImgUrl/:studentCode',
  name: 'Index',
  component: resolve => require(['@/components/Index'], resolve),
  meta: {
    keepAlive: false
  },
  beforeEnter: (to, from, next) => {
    // let activity = JSON.parse(sessionStorage.getItem('activity'))
    // if (activity) {
    //   document.title = activity.activeName
    // }
    next()
  }
}
/**
 * 奖品介绍页
 * @type {{path: string, name: string, component}}
 */
const prize = {
  path: '/prize/:loginId/:activityId',
  name: 'Prize',
  component: resolve => require(['@/components/Prize'], resolve)
}
/**
 * 排行榜
 * @type {{path: string, name: string, component}}
 */
const list = {
  path: '/list/:loginId/:activityId',
  name: 'List',
  component: resolve => require(['@/components/List'], resolve)
}
/**
 * 报名
 * @type {{path: string, name: string, component}}
 */
const register = {
  path: '/register/:loginId/:activityId/:openId',
  name: 'Register',
  component: resolve => require(['@/components/Register'], resolve)
}
/**
 * 容器
 * @type {{path: string, name: string, component, children: *[]}}
 */
const container = {
  path: '/',
  name: 'Container',
  component: Container,
  children: [index, prize, list, register]
}
/**
 * 选手详情
 * @type {{path: string, name: string, title: string, component, meta: {pageTitle: string, keepAlive: boolean}}}
 */
const detail = {
  path: '/detail/:loginId/:activityId/:studentId/:openId/:nickName/:headImgUrl',
  name: 'Detail',
  title: '选手详情',
  component: resolve => require(['@/components/Detail'], resolve),
  meta: {
    pageTitle: '选手详情',
    keepAlive: true
  }
}
/**
 * 礼物赠送
 * @type {{path: string, name: string, component}}
 */
const present = {
  path: '/present/:loginId/:activityId/:studentId',
  name: 'Present',
  component: resolve => require(['@/components/Present'], resolve)
}

const router = new Router({
  routes: [container, present, detail], scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({x: 0, y: 0})
      }, 500)
    })
  }
})

export default router
