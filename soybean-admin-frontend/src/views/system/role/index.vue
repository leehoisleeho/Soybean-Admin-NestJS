<script setup lang="tsx">
import { onActivated, onMounted, ref } from 'vue';
import { NButton, NCard, NDataTable, NFormItemGi, NGrid, NInput, NPopconfirm, NSelect, NSpace, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { useBoolean } from '@sa/hooks';
import { fetchBatchDeleteRole, fetchDeleteRole, fetchRoleList } from '@/service/api/role';
import { useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import RoleModal from './components/role-modal.vue';
import MenuPermissionModal from './components/menu-permission-modal.vue';

let handleEdit: (id: string) => void = () => {};

const { columns, columnChecks, data, loading, getData, searchParams, resetSearchParams, mobilePagination } =
  useNaivePaginatedTable({
    apiFn: fetchRoleList,
    apiParams: {
      page: 1,
      pageSize: 10,
      status: undefined,
      name: undefined,
      code: undefined
    },
    columns: () => [
      { type: 'selection', align: 'center', width: 48 },
      {
        key: 'index',
        title: $t('common.index'),
        width: 64,
        align: 'center',
        render: (_, index) => {
          return index + 1;
        }
      },
      { key: 'name', title: $t('page.manage.role.roleName'), align: 'center', minWidth: 120 },
      { key: 'code', title: $t('page.manage.role.roleCode'), align: 'center', minWidth: 120 },
      { key: 'sort', title: $t('page.manage.role.roleSort'), align: 'center', width: 100 },
      { key: 'remark', title: $t('page.manage.role.remark'), align: 'center', minWidth: 150 },
      {
        key: 'status',
        title: $t('page.manage.role.roleStatus'),
        align: 'center',
        width: 100,
        render: row => {
          if (row.status === null) return null;
          const status = String(row.status) as Api.SystemManage.UserStatus;

          const tagMap: Record<Api.SystemManage.UserStatus, NaiveUI.ThemeColor> = {
            '1': 'success',
            '0': 'error'
          };

          const label = status === '1' ? $t('page.manage.role.status.enable') : $t('page.manage.role.status.disable');

          return <NTag type={tagMap[status]}>{label}</NTag>;
        }
      },
      {
        key: 'createdAt',
        title: $t('common.createTime'),
        align: 'center',
        width: 180,
        render: row => {
          return dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss');
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 250,
        render: row => (
          <div class="flex-center gap-8px">
            <NButton type="primary" ghost size="small" onClick={() => handleEdit(row.id)}>
              {$t('common.edit')}
            </NButton>
            <NButton type="primary" ghost size="small" onClick={() => openMenuPermissionModal(row.id)}>
              {$t('page.manage.role.menuPermission')}
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

const { bool: menuPermissionVisible, setTrue: openMenuPermission } = useBoolean();
const roleId = ref('');

function openMenuPermissionModal(id: string) {
  roleId.value = id;
  openMenuPermission();
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteRole(id);
  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    getData();
  }
}

async function handleBatchDelete() {
  if (checkedRowKeys.value.length === 0) return;

  window.$dialog?.warning({
    title: $t('common.confirmDelete'),
    content: $t('common.confirmDelete'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: async () => {
      const { error } = await fetchBatchDeleteRole(checkedRowKeys.value as string[]);
      if (!error) {
        window.$message?.success($t('common.deleteSuccess'));
        checkedRowKeys.value = [];
        getData();
      }
    }
  });
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="card-wrapper">
      <NForm :model="searchParams" label-placement="left" :label-width="80">
        <NGrid cols="24" :x-gap="24">
          <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.roleName')" path="name">
            <NInput
              v-model:value="searchParams.name"
              :placeholder="$t('page.manage.role.form.roleName')"
              clearable
              class="w-full"
            />
          </NFormItemGi>
          <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.roleStatus')" path="status">
            <NSelect
              v-model:value="searchParams.status"
              :placeholder="$t('page.manage.role.form.roleStatus')"
              :options="[
                { label: $t('page.manage.role.status.enable'), value: '1' },
                { label: $t('page.manage.role.status.disable'), value: '0' }
              ]"
              clearable
              class="w-full"
            />
          </NFormItemGi>
          <NFormItemGi span="24 s:24 m:12">
            <NSpace justify="end" class="w-full">
              <NButton @click="resetSearchParams">
                <template #icon>
                  <icon-ic-round-refresh class="text-icon" />
                </template>
                {{ $t('common.reset') }}
              </NButton>
              <NButton type="primary" ghost @click="getData">
                <template #icon>
                  <icon-ic-round-search class="text-icon" />
                </template>
                {{ $t('common.search') }}
              </NButton>
            </NSpace>
          </NFormItemGi>
        </NGrid>
      </NForm>
    </NCard>

    <NCard
      :title="$t('page.manage.role.title')"
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
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :max-height="650"
        :scroll-x="900"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="flex-1 overflow-hidden"
      />
    </NCard>

    <RoleModal v-model:visible="drawerVisible" :type="operateType" :edit-data="editingData" @submitted="getData" />
    <MenuPermissionModal v-model:visible="menuPermissionVisible" :role-id="roleId" />
  </div>
</template>

<style scoped></style>
