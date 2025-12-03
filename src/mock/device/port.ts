import type { PortInfo } from '@/api/device'

/**
 * 网口列表 Mock 数据
 */
export const PORT_LIST_MOCK_DATA: PortInfo[] = [
  {
    id: '1',
    name: 'eth0',
    type: 'wan',
    status: 'up',
    mac: '00:11:22:33:44:55',
    ip: '192.168.1.100',
    netmask: '255.255.255.0',
    gateway: '192.168.1.1',
    speed: 1000,
    description: '主WAN口，连接外网',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '2',
    name: 'eth1',
    type: 'wan',
    status: 'up',
    mac: '00:11:22:33:44:56',
    ip: '10.0.0.100',
    netmask: '255.255.255.0',
    gateway: '10.0.0.1',
    speed: 1000,
    description: '备用WAN口',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '3',
    name: 'eth2',
    type: 'lan',
    status: 'up',
    mac: '00:11:22:33:44:57',
    ip: '172.16.0.1',
    netmask: '255.255.0.0',
    gateway: '',
    speed: 1000,
    description: 'LAN口1，连接内网设备',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '4',
    name: 'eth3',
    type: 'lan',
    status: 'up',
    mac: '00:11:22:33:44:58',
    ip: '172.16.0.2',
    netmask: '255.255.0.0',
    gateway: '',
    speed: 100,
    description: 'LAN口2，连接办公网络',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '5',
    name: 'eth4',
    type: 'lan',
    status: 'down',
    mac: '00:11:22:33:44:59',
    ip: '',
    netmask: '',
    gateway: '',
    speed: 1000,
    description: 'LAN口3，未启用',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '6',
    name: 'eth5',
    type: 'wan',
    status: 'down',
    mac: '00:11:22:33:44:60',
    ip: '',
    netmask: '',
    gateway: '',
    speed: 1000,
    description: '备用WAN口2，未启用',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '7',
    name: 'eth6',
    type: 'lan',
    status: 'up',
    mac: '00:11:22:33:44:61',
    ip: '172.16.0.3',
    netmask: '255.255.0.0',
    gateway: '',
    speed: 1000,
    description: 'LAN口4，连接服务器',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '8',
    name: 'eth7',
    type: 'lan',
    status: 'up',
    mac: '00:11:22:33:44:62',
    ip: '172.16.0.4',
    netmask: '255.255.0.0',
    gateway: '',
    speed: 100,
    description: 'LAN口5，连接打印机',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '9',
    name: 'eth8',
    type: 'wan',
    status: 'up',
    mac: '00:11:22:33:44:63',
    ip: '203.0.113.100',
    netmask: '255.255.255.0',
    gateway: '203.0.113.1',
    speed: 100,
    description: 'WAN口3，专线连接',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '10',
    name: 'eth9',
    type: 'lan',
    status: 'down',
    mac: '00:11:22:33:44:64',
    ip: '',
    netmask: '',
    gateway: '',
    speed: 1000,
    description: 'LAN口6，预留接口',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '11',
    name: 'eth10',
    type: 'lan',
    status: 'up',
    mac: '00:11:22:33:44:65',
    ip: '172.16.0.5',
    netmask: '255.255.0.0',
    gateway: '',
    speed: 1000,
    description: 'LAN口7，连接监控设备',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  },
  {
    id: '12',
    name: 'eth11',
    type: 'wan',
    status: 'up',
    mac: '00:11:22:33:44:66',
    ip: '198.51.100.50',
    netmask: '255.255.255.0',
    gateway: '198.51.100.1',
    speed: 1000,
    description: 'WAN口4，VPN专线',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-12-01 15:30:00'
  }
]

/**
 * 模拟延迟
 */
const mockDelay = (ms: number = 300) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 模拟分页数据
 */
export const getMockPortList = async (params: {
  current?: number
  size?: number
  type?: 'wan' | 'lan'
  name?: string
  status?: 'up' | 'down'
}) => {
  await mockDelay()

  let filteredData = [...PORT_LIST_MOCK_DATA]

  // 类型筛选
  if (params.type) {
    filteredData = filteredData.filter((item) => item.type === params.type)
  }

  // 名称筛选（模糊搜索）
  if (params.name) {
    const nameLower = params.name.toLowerCase()
    filteredData = filteredData.filter((item) => item.name.toLowerCase().includes(nameLower))
  }

  // 状态筛选
  if (params.status) {
    filteredData = filteredData.filter((item) => item.status === params.status)
  }

  // 分页
  const current = params.current || 1
  const size = params.size || 20
  const start = (current - 1) * size
  const end = start + size
  const records = filteredData.slice(start, end)

  return {
    records,
    current,
    size,
    total: filteredData.length
  }
}

/**
 * 模拟切换网口类型
 */
export const mockSwitchPortType = async (params: { id: string; type: 'wan' | 'lan' }) => {
  await mockDelay(500)

  const port = PORT_LIST_MOCK_DATA.find((item) => item.id === params.id)
  if (!port) {
    throw new Error('网口不存在')
  }

  // 更新类型
  port.type = params.type
  port.updateTime = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return {
    success: true,
    message: `网口 ${port.name} 已切换为 ${params.type.toUpperCase()}`
  }
}
