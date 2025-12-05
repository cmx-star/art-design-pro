import request from '@/utils/http'
import { getMockPortList, mockSwitchPortType } from '@/mock/device/port'

/**
 * 是否使用 Mock 数据（开发环境默认使用）
 */
const USE_MOCK = import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === 'true'

// 使用全局类型定义
export type PortListParams = Api.Device.PortListParams
export type PortInfo = Api.Device.PortInfo
export type PortListResponse = Api.Device.PortList
export type SwitchPortTypeParams = Api.Device.SwitchPortTypeParams
export type DeviceListParams = Api.Device.DeviceListParams
export type DeviceInfo = Api.Device.DeviceInfo
export type DeviceListResponse = Api.Device.DeviceList

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

/**
 * 获取设备列表
 */
export async function fetchGetDeviceList(params: DeviceListParams): Promise<DeviceListResponse> {
  if (USE_MOCK) {
    // TODO: 实现设备列表的 Mock 数据
    return {
      records: [
        {
          id: '1',
          name: '主路由器',
          type: 'router',
          status: 'online',
          ip: '192.168.1.1',
          mac: '00:11:22:33:44:55',
          model: 'RT-AX86U',
          portCount: 8,
          description: '主要网络设备',
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-12-05 15:30:00'
        },
        {
          id: '2',
          name: '核心交换机',
          type: 'switch',
          status: 'online',
          ip: '192.168.1.10',
          mac: '00:11:22:33:44:66',
          model: 'SG350-28',
          portCount: 28,
          description: '核心网络交换设备',
          createTime: '2024-01-01 10:30:00',
          updateTime: '2024-12-05 15:30:00'
        },
        {
          id: '3',
          name: '边界防火墙',
          type: 'firewall',
          status: 'offline',
          ip: '192.168.1.20',
          mac: '00:11:22:33:44:77',
          model: 'ASA5506-X',
          portCount: 6,
          description: '网络安全防护设备',
          createTime: '2024-01-01 11:00:00',
          updateTime: '2024-12-05 15:30:00'
        }
      ],
      total: 3,
      current: params.current || 1,
      size: params.size || 20
    }
  }

  return request.get<DeviceListResponse>({
    url: '/api/device/list',
    params
  })
}
