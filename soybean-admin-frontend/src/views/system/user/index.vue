<script setup lang="tsx">
import { onActivated, onMounted, ref } from 'vue';
import { NButton, NCard, NDataTable, NFormItemGi, NGrid, NInput, NPopconfirm, NSpace, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { useBoolean } from '@sa/hooks';
import { fetchBatchDeleteUser, fetchDeleteUser, fetchUserList } from '@/service/api/user';
import { useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import UserModal from './components/user-modal.vue';
import RoleAssignModal from './components/role-assign-modal.vue';
import ResetPasswordModal from './components/reset-password-modal.vue';

function transformUserListResponse(response: any): { data: any[]; pageNum: number; pageSize: number; total: number } {
  if (response && response.records !== undefined) {
    return {
      data: response.records || [],
      pageNum: response.current || 1,
      pageSize: response.size || 10,
      total: response.total || 0
    };
  }

  if (response && response.data && response.data.records !== undefined) {
    const data = response.data;
    return {
      data: data.records || [],
      pageNum: data.current || 1,
      pageSize: data.size || 10,
      total: data.total || 0
    };
  }

  return {
    data: [],
    pageNum: 1,
    pageSize: 10,
    total: 0
  };
}

let handleEdit: (id: string) => void = () => { };

const { columns, columnChecks, data, loading, getData, searchParams, resetSearchParams, mobilePagination } =
  useNaivePaginatedTable({
    apiFn: fetchUserList,
    apiParams: {
      page: 1,
      pageSize: 10,
      status: undefined,
      username: '',
      nickname: '',
      email: '',
      phone: ''
    },
    transform: transformUserListResponse,
    columns: () => [
      { type: 'selection', align: 'center', width: 48 },
      {
        key: 'index',
        title: $t('common.index'),
        width: 64,
        align: 'center',
        render: (_row, index) => {
          return index + 1;
        }
      },
      { key: 'username', title: $t('page.manage.user.userName'), align: 'center', minWidth: 120 },
      { key: 'nickname', title: $t('page.manage.user.nickName'), align: 'center', minWidth: 120 },
      { key: 'email', title: $t('page.manage.user.userEmail'), align: 'center', minWidth: 150 },
      { key: 'phone', title: $t('page.manage.user.userPhone'), align: 'center', minWidth: 120 },
      {
        key: 'status',
        title: $t('page.manage.user.userStatus'),
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
        key: 'createdAt',
        title: $t('common.createTime'),
        align: 'center',
        width: 180,
        render: row => {
          return row.createdAt ? dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '';
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 330,
        render: row => (
          <div class="flex-center gap-8px">
            <NButton type="primary" ghost size="small" onClick={() => handleEdit(row.id)}>
              {$t('common.edit')}
            </NButton>
            <NButton type="primary" ghost size="small" onClick={() => openAssignRoleModal(row.id)}>
              {$t('page.manage.user.assignRole')}
            </NButton>
            <NButton type="warning" ghost size="small" onClick={() => openResetPasswordModal(row.id)}>
              {$t('page.manage.user.resetPassword')}
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

const { bool: assignRoleVisible, setTrue: openAssignRoleModalBool } = useBoolean();
const assignRoleUserId = ref('');

function openAssignRoleModal(id: string) {
  assignRoleUserId.value = id;
  openAssignRoleModalBool();
}

const { bool: resetPasswordVisible, setTrue: openResetPasswordModalBool } = useBoolean();
const resetPasswordUserId = ref('');

function openResetPasswordModal(id: string) {
  resetPasswordUserId.value = id;
  openResetPasswordModalBool();
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteUser(id);
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
      const { error } = await fetchBatchDeleteUser(checkedRowKeys.value as string[]);
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
          <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userName')" path="username">
            <NInput v-model:value="searchParams.username" :placeholder="$t('page.manage.user.form.userName')"
              class="w-full" clearable />
          </NFormItemGi>
          <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userPhone')" path="phone">
            <NInput v-model:value="searchParams.phone" :placeholder="$t('page.manage.user.form.userPhone')"
              class="w-full" clearable />
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

    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small"
      class="flex-1 overflow-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading" @add="handleAdd" @delete="handleBatchDelete" @refresh="getData" />
      </template>
      <NDataTable v-model:checked-row-keys="checkedRowKeys" :columns="columns" :data="data" size="small"
        :max-height="650" :scroll-x="1100" :loading="loading" remote :row-key="row => row.id"
        :pagination="mobilePagination" class="flex-1 overflow-hidden" />
    </NCard>

    <UserModal v-model:visible="drawerVisible" :type="operateType" :edit-data="editingData" @submitted="getData" />
    <RoleAssignModal v-model:visible="assignRoleVisible" :user-id="assignRoleUserId" @submitted="getData" />
    <ResetPasswordModal v-model:visible="resetPasswordVisible" :user-id="resetPasswordUserId" @submitted="getData" />
  </div>
</template>

<style scoped></style>
