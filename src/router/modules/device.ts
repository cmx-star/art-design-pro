import { AppRouteRecord } from '@/types/router'

export const deviceRoutes: AppRouteRecord = {
  path: '/device',
  name: 'Device',
  component: '/index/index',
  meta: {
    title: 'menus.device.title',
    icon: 'ri:router-line',
    roles: ['R_SUPER', 'R_ADMIN']
  },
  children: [
    {
      path: 'port',
      name: 'DevicePort',
      component: '/device/port',
      meta: {
        title: 'menus.device.port',
        keepAlive: true,
        roles: ['R_SUPER', 'R_ADMIN']
      }
    }
  ]
}
