import type { App } from 'vue'
import { setupAuthDirective } from './core/auth'
import { setupRolesDirective } from './core/roles'

export function setupGlobDirectives(app: App) {
  setupAuthDirective(app) // 权限指令
  setupRolesDirective(app) // 角色权限指令
}
