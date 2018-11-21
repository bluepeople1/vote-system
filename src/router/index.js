import Vue from 'vue';
import Router from 'vue-router';

import Container from '@/components/Container'; //容器
import IndexPage from '@/components/Index'; //首页
import PrizePage from '@/components/Prize'; //规则、奖品介绍
import ListPage from '@/components/List'; //榜单列表页
import DetailPage from '@/components/Detail'; //详情页
import PresentPage from '@/components/Present'; //礼物赠送页
import RegisterPage from '@/components/Register'; //报名
import VumPage from '@/components/Vum'; //报名
import SuccessPage from '@/components/SuccessPage'; //操作成功页面
import FailurePage from '@/components/FailurePage'; //操作失败页面


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Container',
      component: Container,
      children: [
        {
          path: '/index/:uuid',
          name: 'Index',
          component: IndexPage,
          meta: {
            keepAlive: false
          },
          beforeEnter:(to,from,next)=>{
            let activity=JSON.parse(sessionStorage.getItem('activity'));
            if(activity){
              document.title=activity.activeName;
            }
            next();
          }
        },
        {
          path: '/prize',
          name: 'Prize',
          component: PrizePage,
        },
        {
          path: '/list',
          name: 'List',
          component: ListPage,
        },
        {
          path: '/register',
          name: 'Register',
          component: RegisterPage,
        },
      ]
    },
    {
      path: '/detail/:userInfo',
      name: 'Detail',
      title: '详情页',
      component: DetailPage,
      meta: {
        pageTitle: '详情页',
        keepAlive: true
      }
    }
    ,
    {
      path: '/present/:userInfo',
      name: 'Present',
      component: PresentPage,
    },

    {
      path: '/vum',
      name: 'Vum',
      component: VumPage,
    },

    {
      path: '/success/:payInfo',
      name: 'Success',
      component: SuccessPage,
    },
    {
      path: '/failure/:payInfo',
      name: 'Failure',
      component: FailurePage,
    }
  ]
});
