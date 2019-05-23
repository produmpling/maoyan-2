/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */
/* Layout */
import Layout from '@/components/common/layouts/default';

/**
 * meta里字段释义
 * 1. auth 是否需要授权才能访问该页面，默认需要授权（不设置或设置为true为需要授权，false为不需授权）
 * 2. menuName 菜单项的名字，面包屑导航时显示该名字
 * 3. parentMenuId 父菜单id，面包屑导航时用于跳转到父级菜单地址
 * 4. showLeftbar 是否显示左边菜单栏，默认显示，（不设置或设置为true为显示，false为不显示）
 * 5. showBreadcrumb 是否显示面包屑导航，默认显示（值同showLeftbar的设置）
 */

export default [
  {
    path: '/login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/login/index'),
    name: 'login',
    meta: {
      auth: false,
    },
  },
  // 轮播
  {
    path: '/banners',
    redirect: '/banners/list',
    name: 'banners',
    component: Layout,
    meta: {
      auth: true,
      menuName: '轮播',
    },
    children: [
      {
        path: 'list',
        name: 'banners.list',
        component: () =>
          import(/* webpackChunkName: "banners.list" */ '@/views/banners/list'),
        meta: {
          auth: true,
          menuName: '列表',
          parentMenuId: 'banners',
        },
      },
    ],
  },
  // 影片
  {
    path: '/movie',
    redirect: '/movie/list',
    name: 'movie',
    component: Layout,
    meta: {
      auth: true,
      menuName: '影片',
    },
    children: [
      {
        path: 'list',
        name: 'movie.list',
        component: () =>
          import(/* webpackChunkName: "movie.list" */ '@/views/movie/list'),
        meta: {
          auth: true,
          menuName: '列表',
          parentMenuId: 'movie',
        },
      },
    ],
  },
  // 影院
  {
    path: '/theater',
    redirect: '/theater/list',
    name: 'theater',
    component: Layout,
    meta: {
      auth: true,
      menuName: '影院',
    },
    children: [
      {
        path: 'list',
        name: 'theater.list',
        component: () =>
          import(/* webpackChunkName: "theater.list" */ '@/views/theater/list'),
        meta: {
          auth: true,
          menuName: '列表',
          parentMenuId: 'theater',
        },
      },
    ],
  },
  // 订单
  {
    path: '/order',
    redirect: '/order/list',
    name: 'order',
    component: Layout,
    meta: {
      auth: true,
      menuName: '订单',
    },
    children: [
      {
        path: 'list',
        name: 'order.list',
        component: () =>
          import(/* webpackChunkName: "order.list" */ '@/views/order/list'),
        meta: {
          auth: true,
          menuName: '列表',
          parentMenuId: 'order',
        },
      },
    ],
  },
  // 影评
  {
    path: '/comment',
    redirect: '/comment/list',
    name: 'comment',
    component: Layout,
    meta: {
      auth: true,
      menuName: '影评',
    },
    children: [
      {
        path: 'list',
        name: 'comment.list',
        component: () =>
          import(/* webpackChunkName: "comment.list" */ '@/views/comment/list'),
        meta: {
          auth: true,
          menuName: '列表',
          parentMenuId: 'comment',
        },
      },
    ],
  },
  // 演员
  {
    path: '/actor',
    redirect: '/actor/list',
    name: 'actor',
    component: Layout,
    meta: {
      auth: true,
      menuName: '演员',
    },
    children: [
      {
        path: 'list',
        name: 'actor.list',
        component: () =>
          import(/* webpackChunkName: "actor.list" */ '@/views/actor/list'),
        meta: {
          auth: true,
          menuName: '列表',
          parentMenuId: 'actor',
        },
      },
    ],
  },
  // user
  {
    path: '/users',
    redirect: '/users/list',
    name: 'users',
    component: Layout,
    meta: {
      auth: true,
      menuName: '',
    },
    children: [
      {
        path: 'list',
        name: 'user.list',
        component: () =>
          import(/* webpackChunkName: "user.list" */ '@/views/users/list'),
        meta: {
          auth: true,
          menuName: '列表',
          parentMenuId: 'users',
        },
      },
    ],
  },
  // home
  {
    path: '/home',
    redirect: '/home/index',
    name: 'home',
    component: Layout,
    meta: {
      auth: false,
      menuName: '仪表盘',
    },
    children: [
      {
        path: 'index',
        name: 'home.index',
        component: () =>
          import(/* webpackChunkName: "home.index" */ '@/views/home/index'),
        meta: {
          menuName: '仪表盘',
          parentMenuId: 'home',
          showBreadcrumb: false,
        },
      },
    ],
  },

  // system
  {
    path: '/system',
    redirect: '/system/list',
    name: 'system',
    component: Layout,
    meta: {
      auth: true,
      menuName: '系统',
    },
    children: [
      {
        path: 'list',
        name: 'system.list',
        component: () =>
          import(/* webpackChunkName: "system.list" */ '@/views/system/list'),
        meta: {
          auth: true,
          menuName: '账号',
          parentMenuId: 'system',
        },
      },
    ],
  },
  {
    path: '/',
    redirect: '/home',
    // redirect: {
    //   name: 'home',
    // },
  },
];
