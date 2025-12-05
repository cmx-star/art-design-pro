import { AppRouteRecord } from '@/types/router'

export const deviceRoutes: AppRouteRecord = {
  path: '/device',
  name: 'Device',
  component: '/index/index',
  redirect: '/device/list', // 默认重定向到设备列表
  meta: {
    title: 'menus.device.title',
    icon: 'ri:router-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'list',
      name: 'DeviceList',
      component: '/device/list',
      meta: {
        title: 'menus.device.list',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    },
    {
      path: 'port',
      name: 'DevicePort',
      component: '/device/port',
      meta: {
        title: 'menus.device.port',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN'],
        isHide: true // 不在左侧菜单中显示
      }
    }
  ]
}
