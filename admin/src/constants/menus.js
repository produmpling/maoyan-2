// 菜单
export default [
  {
    id: 'home',
    href: '/home',
    name: '仪表盘',
    icon: 'icon-dashboard',
  },
  {
    id: 'banners',
    href: '/banners',
    name: '轮播',
    icon: 'icon-image',
  },
  {
    id: 'movie',
    href: '/movie',
    name: '影片',
    icon: 'icon-video',
  },
  {
    id: 'theater',
    href: '/theater',
    name: '影院',
    icon: 'icon-shop',
  },
  {
    id: 'order',
    href: '/order',
    name: '订单',
    icon: 'icon-orderedlist',
  },
  {
    id: 'comment',
    href: '/comment',
    name: '影评',
    icon: 'icon-comment',
  },
  {
    id: 'actor',
    href: '/actor',
    name: '演员',
    icon: 'icon-user',
  },
  {
    id: 'users',
    href: '/users',
    name: '用户',
    icon: 'icon-team',
    // 功能权限
    authRoleTypeForFunction: {
      // 超管
      1: ['changeAmount', 'changeStatus', 'addUser'],
      // 操作员
      2: ['addUser'],
    },
  },
  {
    id: 'system',
    href: '/system',
    name: '系统',
    icon: 'icon-setting',
    submenus: [
      {
        href: '/system/list',
        name: '账号',
      },
    ],
  },
];
