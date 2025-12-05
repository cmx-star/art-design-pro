<!-- 网口管理页面 -->
<template>
  <div class="port-page art-full-height">
    <!-- 面包屑导航 -->
    <div v-if="deviceId" class="mb-4">
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem>
          <ElButton type="primary" link @click="goBack">
            <Icon icon="ri:arrow-left-line" class="mr-1" />
            返回设备列表
          </ElButton>
        </ElBreadcrumbItem>
        <ElBreadcrumbItem>网口管理 (设备ID: {{ deviceId }})</ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>

    <!-- 搜索栏 -->
    <ArtSearchBar
      v-model="searchForm"
      :items="formItems"
      :showExpand="false"
      @reset="handleReset"
      @search="handleSearch"
    />

    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton
              v-auth="'switch'"
              type="primary"
              :disabled="selectedRows.length === 0"
              @click="handleBatchSwitch"
            >
              批量切换类型
            </ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetPortList, fetchSwitchPortType, type PortInfo } from '@/api/device'
  import {
    ElTag,
    ElMessageBox,
    ElMessage,
    ElButton,
    ElBreadcrumb,
    ElBreadcrumbItem
  } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { Icon } from '@iconify/vue'
  import { h } from 'vue'

  defineOptions({ name: 'DevicePort' })

  // 选中行
  const selectedRows = ref<PortInfo[]>([])

  // 获取路由参数中的设备ID
  const route = useRoute()
  const router = useRouter()
  const deviceId = computed(() => route.query.deviceId as string)

  // 搜索表单
  const searchForm = ref({
    type: undefined as 'wan' | 'lan' | undefined,
    name: undefined,
    status: undefined as 'up' | 'down' | undefined,
    deviceId: deviceId.value // 添加设备ID到搜索参数
  })

  // 自动刷新定时器
  let refreshTimer: ReturnType<typeof setInterval> | null = null

  // 表单配置项
  const formItems = computed(() => [
    {
      label: '网口类型',
      key: 'type',
      type: 'select',
      props: {
        placeholder: '请选择网口类型',
        clearable: true,
        options: [
          { label: 'WAN', value: 'wan' },
          { label: 'LAN', value: 'lan' }
        ]
      }
    },
    {
      label: '网口名称',
      key: 'name',
      type: 'input',
      props: { placeholder: '请输入网口名称', clearable: true }
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '启用', value: 'up' },
          { label: '禁用', value: 'down' }
        ]
      }
    }
  ])

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    searchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchGetPortList,
      apiParams: {
        current: 1,
        size: 20,
        ...searchForm.value
      },
      columnsFactory: () => [
        { type: 'selection' },
        { type: 'index', width: 60, label: '序号' },
        {
          prop: 'name',
          label: '网口名称',
          minWidth: 120
        },
        {
          prop: 'type',
          label: '类型',
          width: 100,
          formatter: (row: PortInfo) => {
            const typeConfig =
              row.type === 'wan'
                ? { type: 'primary' as const, text: 'WAN' }
                : { type: 'success' as const, text: 'LAN' }
            return h(ElTag, { type: typeConfig.type }, () => typeConfig.text)
          }
        },
        {
          prop: 'status',
          label: '状态',
          width: 100,
          formatter: (row: PortInfo) => {
            const statusConfig =
              row.status === 'up'
                ? { type: 'success' as const, text: '启用' }
                : { type: 'danger' as const, text: '禁用' }
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          prop: 'mac',
          label: 'MAC地址',
          minWidth: 140
        },
        {
          prop: 'ip',
          label: 'IP地址',
          minWidth: 120
        },
        {
          prop: 'speed',
          label: '速率',
          width: 100,
          formatter: (row: PortInfo) => (row.speed ? `${row.speed} Mbps` : '-')
        },
        {
          prop: 'description',
          label: '描述',
          minWidth: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'operation',
          label: '操作',
          width: 150,
          fixed: 'right',
          formatter: (row: PortInfo) =>
            h('div', { class: 'flex-c gap-2' }, [
              h(
                ElButton,
                {
                  size: 'small',
                  type: row.type === 'wan' ? 'success' : 'primary',
                  vAuth: 'switch',
                  onClick: () => handleSwitchType(row)
                },
                () => (row.type === 'wan' ? '切换为LAN' : '切换为WAN')
              )
            ])
        }
      ]
    }
  })

  /**
   * 搜索处理
   */
  const handleSearch = () => {
    Object.assign(searchParams, searchForm.value)
    getData()
  }

  /**
   * 重置搜索
   */
  const handleReset = () => {
    searchForm.value = {
      type: undefined,
      name: undefined,
      status: undefined,
      deviceId: deviceId.value
    }
    resetSearchParams()
    getData()
  }

  /**
   * 切换网口类型
   */
  const handleSwitchType = async (row: PortInfo) => {
    const targetType = row.type === 'wan' ? 'lan' : 'wan'
    try {
      await ElMessageBox.confirm(
        `确定要将网口 "${row.name}" 从 ${row.type.toUpperCase()} 切换为 ${targetType.toUpperCase()} 吗？`,
        '切换网口类型',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      await fetchSwitchPortType({
        id: row.id,
        type: targetType
      })

      ElMessage.success('切换成功')
      refreshData()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('切换失败')
      }
    }
  }

  /**
   * 批量切换类型
   */
  const handleBatchSwitch = async () => {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('请先选择要切换的网口')
      return
    }

    // 检查选中的网口是否都是同一类型
    const types = new Set(selectedRows.value.map((row) => row.type))
    if (types.size > 1) {
      ElMessage.warning('批量切换时，选中的网口类型必须一致')
      return
    }

    const currentType = selectedRows.value[0].type
    const targetType = currentType === 'wan' ? 'lan' : 'wan'

    try {
      await ElMessageBox.confirm(
        `确定要将选中的 ${selectedRows.value.length} 个网口从 ${currentType.toUpperCase()} 切换为 ${targetType.toUpperCase()} 吗？`,
        '批量切换网口类型',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      // 批量切换
      const promises = selectedRows.value.map((row) =>
        fetchSwitchPortType({
          id: row.id,
          type: targetType
        })
      )

      await Promise.all(promises)
      ElMessage.success('批量切换成功')
      selectedRows.value = []
      refreshData()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('批量切换失败')
      }
    }
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: PortInfo[]): void => {
    selectedRows.value = selection
  }

  /**
   * 启动自动刷新（每10秒）
   */
  const startAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }
    refreshTimer = setInterval(() => {
      refreshData()
    }, 10000) // 10秒 = 10000毫秒
  }

  /**
   * 停止自动刷新
   */
  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  // 页面挂载时启动自动刷新
  onMounted(() => {
    startAutoRefresh()
  })

  // 页面卸载时清除定时器
  onUnmounted(() => {
    stopAutoRefresh()
  })

  /**
   * 返回设备列表
   */
  const goBack = () => {
    router.push({ name: 'DeviceList' })
  }
</script>

<style lang="scss" scoped>
  .port-page {
    padding: 12px;
  }
</style>
