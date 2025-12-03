import { AppRouteRecord } from '@/types/router'
import { dashboardRoutes } from './dashboard'
import { systemRoutes } from './system'
import { deviceRoutes } from './device'
import { resultRoutes } from './result'
import { exceptionRoutes } from './exception'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [
  dashboardRoutes,
  systemRoutes,
  deviceRoutes,
  resultRoutes,
  exceptionRoutes
]
