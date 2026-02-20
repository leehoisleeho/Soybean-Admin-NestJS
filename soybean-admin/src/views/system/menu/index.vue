<script setup lang="tsx">
import { onActivated, onMounted } from 'vue';
import { NButton, NCard, NDataTable, NPopconfirm, NTag } from 'naive-ui';
import { fetchBatchDeleteMenu, fetchDeleteMenu, fetchMenuList } from '@/service/api/menu';
import { useNaiveTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import SvgIcon from '@/components/custom/svg-icon.vue';
import MenuModal from './components/menu-modal.vue';

let handleEdit: (id: string) => void = () => {};
let handleAddChild: (parentId: string) => void = () => {};

function parseMenuIcon(value: string | null | undefined) {
  const iconValue = (value || '').trim();
  return { icon: iconValue };
}

function edit(row: Api.SystemManage.Menu) {
  handleEdit(row.id);
}

const { columns, columnChecks, data, loading, getData } = useNaiveTable({
  apiFn: fetchMenuList,
  columns: () => [
    { type: 'selection', align: 'center', width: 48 },
    { key: 'name', title: $t('page.manage.menu.menuName'), minWidth: 180, fixed: 'left' },
    {
      key: 'icon',
      title: $t('page.manage.menu.icon'),
      align: 'center',
      width: 60,
      render: row => (
        <div class="flex-center">
          <SvgIcon {...parseMenuIcon(row.icon)} class="text-30px" />
        </div>
      )
    },
    {
      key: 'type',
      title: $t('page.manage.menu.menuType'),
      align: 'center',
      width: 100,
      render: row => {
        const type = String(row.type) as '1' | '2' | '3';
        const tagMap: Record<'1' | '2' | '3', NaiveUI.ThemeColor> = {
          '1': 'primary',
          '2': 'success',
          '3': 'warning'
        };
        const labelMap: Record<'1' | '2' | '3', string> = {
          '1': $t('page.manage.menu.type.directory'),
          '2': $t('page.manage.menu.type.menu'),
          '3': $t('page.manage.menu.type.button')
        };
        return <NTag type={tagMap[type]}>{labelMap[type]}</NTag>;
      }
    },
    { key: 'path', title: $t('page.manage.menu.routePath'), align: 'center', minWidth: 150 },
    { key: 'permission', title: $t('page.manage.menu.permission'), align: 'center', minWidth: 150 },
    { key: 'sort', title: $t('page.manage.menu.menuSort'), align: 'center', width: 80 },
    {
      key: 'status',
      title: $t('page.manage.menu.menuStatus'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) return null;

        const status = String(row.status) as Api.SystemManage.UserStatus;

        const tagMap: Record<Api.SystemManage.UserStatus, NaiveUI.ThemeColor> = {
          '1': 'success',
          '0': 'error'
        };

        const label = status === '1' ? $t('page.manage.user.status.enable') : $t('page.manage.user.status.disable');

        return <NTag type={tagMap[status]}>{label}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 250,
      render: row => (
        <div class="flex-center gap-8px">
          {row.type !== 3 && (
            <NButton type="primary" ghost size="small" onClick={() => handleAddChild(row.id)}>
              {$t('common.add')}
            </NButton>
          )}
          <NButton type="primary" ghost size="small" onClick={() => edit(row)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

onMounted(async () => {
  await getData();
});

onActivated(async () => {
  if (data.value.length === 0) {
    await getData();
  }
});

const tableOperate = useTableOperate(data, 'id', getData);

const { drawerVisible, operateType, editingData, handleAdd, checkedRowKeys } = tableOperate;

handleEdit = tableOperate.handleEdit;

handleAddChild = (parentId: string) => {
  handleAdd();
  editingData.value = { parentId } as any;
};

async function onBatchDeleted() {
  const { error } = await fetchBatchDeleteMenu(checkedRowKeys.value as string[]);
  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    checkedRowKeys.value = [];
    getData();
  }
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteMenu(id);
  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    getData();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard
      :title="$t('page.manage.menu.title')"
      :bordered="false"
      size="small"
      class="flex-1 overflow-hidden card-wrapper"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="onBatchDeleted"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :max-height="600"
        :loading="loading"
        :row-key="row => row.id"
        default-expand-all
        class="flex-1 overflow-hidden"
      />
    </NCard>

    <MenuModal v-model:visible="drawerVisible" :type="operateType" :edit-data="editingData" @submitted="getData" />
  </div>
</template>

<style scoped></style>
