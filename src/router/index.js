import Vue from 'vue'
import Router from 'vue-router'

import Container from '@/components/Container' //容器
import IndexPage from '@/components/Index' //首页
import PrizePage from '@/components/Prize' //规则、奖品介绍
import ListPage from '@/components/List' //榜单列表页
import DetailPage from '@/components/Detail' //详情页
import PresentPage from '@/components/Present' //礼物赠送页
import RegisterPage from '@/components/Register' //报名

Vue.use(Router)

/**
 * 首页
 * @type {{path: string, name: string, component, meta: {keepAlive: boolean}, beforeEnter: index.beforeEnter}}
 */
const index = {
  path: '/index/:uuid',
  name: 'Index',
  component: IndexPage,
  meta: {
    keepAlive: false
  },
  beforeEnter: (to, from, next) => {
    let activity = JSON.parse(sessionStorage.getItem('activity'))
    if (activity) {
      document.title = activity.activeName
    }
    next()
  }
}
/**
 * 奖品介绍页
 * @type {{path: string, name: string, component}}
 */
const prize = {
  path: '/prize',
  name: 'Prize',
  component: PrizePage
}
/**
 * 排行榜
 * @type {{path: string, name: string, component}}
 */
const list = {
  path: '/list',
  name: 'List',
  component: ListPage
}
/**
 * 报名
 * @type {{path: string, name: string, component}}
 */
const register = {
  path: '/register',
  name: 'Register',
  component: RegisterPage
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

const detail = {
  path: '/detail',
  name: 'Detail',
  title: '选手详情',
  component: DetailPage,
  meta: {
    pageTitle: '选手详情',
    keepAlive: true
  }
}

const present = {
  path: '/present/:userInfo',
  name: 'Present',
  component: PresentPage
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

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Container',
//       component: Container,
//       children: [
//         {
//           path: '/index/:uuid',
//           name: 'Index',
//           component: IndexPage,
//           meta: {
//             keepAlive: false
//           },
//           beforeEnter: (to, from, next) => {
//             let activity = JSON.parse(sessionStorage.getItem('activity'))
//             if (activity) {
//               document.title = activity.activeName
//             }
//             next()
//           }
//         },
//         {
//           path: '/prize',
//           name: 'Prize',
//           component: PrizePage
//         },
//         {
//           path: '/list',
//           name: 'List',
//           component: ListPage
//         },
//         {
//           path: '/register',
//           name: 'Register',
//           component: RegisterPage
//         }
//       ]
//     },
//     {
//       path: '/detail/:userInfo',
//       name: 'Detail',
//       title: '详情页',
//       component: DetailPage,
//       meta: {
//         pageTitle: '详情页',
//         keepAlive: true
//       }
//     }
//     ,
//     {
//       path: '/present/:userInfo',
//       name: 'Present',
//       component: PresentPage
//     },
//
//     {
//       path: '/vum',
//       name: 'Vum',
//       component: VumPage
//     },
//
//     {
//       path: '/success/:payInfo',
//       name: 'Success',
//       component: SuccessPage
//     },
//     {
//       path: '/failure/:payInfo',
//       name: 'Failure',
//       component: FailurePage
//     }
//   ]
// })
