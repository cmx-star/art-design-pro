import request from '@/utils/http'
import { getMockPortList, mockSwitchPortType } from '@/mock/device/port'

/**
 * 是否使用 Mock 数据（开发环境默认使用）
 */
const USE_MOCK = import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 网口列表查询参数
 */
export interface PortListParams extends Api.Common.PaginationParams {
  /** 网口类型：wan/lan */
  type?: 'wan' | 'lan'
  /** 网口名称（模糊搜索） */
  name?: string
  /** 状态：up/down */
  status?: 'up' | 'down'
}

/**
 * 网口信息
 */
export interface PortInfo {
  /** 网口ID */
  id: string
  /** 网口名称 */
  name: string
  /** 网口类型：wan/lan */
  type: 'wan' | 'lan'
  /** 状态：up/down */
  status: 'up' | 'down'
  /** MAC地址 */
  mac: string
  /** IP地址 */
  ip?: string
  /** 子网掩码 */
  netmask?: string
  /** 网关 */
  gateway?: string
  /** 速率（Mbps） */
  speed?: number
  /** 描述信息 */
  description?: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 网口列表响应
 */
export type PortListResponse = Api.Common.PaginatedResponse<PortInfo>

/**
 * 切换网口类型参数
 */
export interface SwitchPortTypeParams {
  /** 网口ID */
  id: string
  /** 目标类型：wan/lan */
  type: 'wan' | 'lan'
}

/**
 * 获取网口列表
 */
export async function fetchGetPortList(params: PortListParams): Promise<PortListResponse> {
  if (USE_MOCK) {
    const result = await getMockPortList(params)
    return result as PortListResponse
  }

  return request.get<PortListResponse>({
    url: '/api/device/port/list',
    params
  })
}

/**
 * 切换网口类型（WAN/LAN）
 */
export async function fetchSwitchPortType(
  params: SwitchPortTypeParams
): Promise<{ success: boolean; message: string }> {
  if (USE_MOCK) {
    const result = await mockSwitchPortType(params)
    return result
  }

  return request.post<{ success: boolean; message: string }>({
    url: '/api/device/port/switch-type',
    data: params,
    showSuccessMessage: true
  })
}
