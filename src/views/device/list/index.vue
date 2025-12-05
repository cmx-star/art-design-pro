<!-- 设备列表页面 -->
<template>
  <div class="device-list-page art-full-height">
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
            <ElButton type="primary" @click="handleAdd">
              <Icon icon="ri:add-line" class="mr-1" />
              添加设备
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
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { useTable } from '@/hooks/core/useTable'
  import { fetchGetDeviceList, type DeviceInfo } from '@/api/device'
  import { ElTag, ElButton, ElSpace } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { Icon } from '@iconify/vue'
  import { h } from 'vue'

  defineOptions({ name: 'DeviceList' })

  const router = useRouter()

  // 搜索表单
  const searchForm = ref({
    name: undefined,
    type: undefined,
    status: undefined as 'online' | 'offline' | undefined
  })

  // 表单配置项
  const formItems = computed(() => [
    {
      label: '设备名称',
      key: 'name',
      type: 'input',
      props: { placeholder: '请输入设备名称', clearable: true }
    },
    {
      label: '设备类型',
      key: 'type',
      type: 'select',
      props: {
        placeholder: '请选择设备类型',
        clearable: true,
        options: [
          { label: '路由器', value: 'router' },
          { label: '交换机', value: 'switch' },
          { label: '防火墙', value: 'firewall' }
        ]
      }
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '在线', value: 'online' },
          { label: '离线', value: 'offline' }
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
      apiFn: fetchGetDeviceList,
      apiParams: {
        current: 1,
        size: 20,
        ...searchForm.value
      },
      columnsFactory: () => [
        { type: 'index', width: 60, label: '序号' },
        {
          prop: 'name',
          label: '设备名称',
          minWidth: 150
        },
        {
          prop: 'type',
          label: '设备类型',
          width: 120,
          formatter: (row: DeviceInfo) => {
            const typeMap = {
              router: { type: 'primary' as const, text: '路由器' },
              switch: { type: 'success' as const, text: '交换机' },
              firewall: { type: 'warning' as const, text: '防火墙' }
            }
            const config = typeMap[row.type] || { type: 'info' as const, text: row.type }
            return h(ElTag, { type: config.type }, () => config.text)
          }
        },
        {
          prop: 'status',
          label: '状态',
          width: 100,
          formatter: (row: DeviceInfo) => {
            const statusConfig =
              row.status === 'online'
                ? { type: 'success' as const, text: '在线' }
                : { type: 'danger' as const, text: '离线' }
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          prop: 'ip',
          label: 'IP地址',
          minWidth: 140
        },
        {
          prop: 'mac',
          label: 'MAC地址',
          minWidth: 160
        },
        {
          prop: 'model',
          label: '设备型号',
          minWidth: 150
        },
        {
          prop: 'portCount',
          label: '网口数量',
          width: 100,
          formatter: (row: DeviceInfo) => `${row.portCount || 0} 个`
        },
        {
          prop: 'description',
          label: '描述',
          minWidth: 200,
          showOverflowTooltip: true
        },
        {
          prop: 'operation',
          label: '操作',
          width: 200,
          fixed: 'right',
          formatter: (row: DeviceInfo) =>
            h('div', { class: 'flex-c gap-2' }, [
              h(
                ElButton,
                {
                  size: 'small',
                  type: 'primary',
                  onClick: () => handlePortManagement(row)
                },
                () => '网口管理'
              ),
              h(
                ElButton,
                {
                  size: 'small',
                  onClick: () => handleEdit(row)
                },
                () => '编辑'
              ),
              h(
                ElButton,
                {
                  size: 'small',
                  type: 'danger',
                  onClick: () => handleDelete(row)
                },
                () => '删除'
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
      name: undefined,
      type: undefined,
      status: undefined
    }
    resetSearchParams()
    getData()
  }

  /**
   * 添加设备
   */
  const handleAdd = () => {
    // TODO: 实现添加设备功能
    console.log('添加设备')
  }

  /**
   * 编辑设备
   */
  const handleEdit = (row: DeviceInfo) => {
    // TODO: 实现编辑设备功能
    console.log('编辑设备', row)
  }

  /**
   * 删除设备
   */
  const handleDelete = (row: DeviceInfo) => {
    // TODO: 实现删除设备功能
    console.log('删除设备', row)
  }

  /**
   * 网口管理
   */
  const handlePortManagement = (row: DeviceInfo) => {
    router.push({
      name: 'DevicePort',
      query: { deviceId: row.id }
    })
  }
</script>

<style lang="scss" scoped>
  .device-list-page {
    padding: 12px;
  }
</style>
