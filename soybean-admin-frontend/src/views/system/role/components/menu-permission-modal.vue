<script setup lang="ts">
import { ref, watch } from 'vue';
import { NButton, NModal, NSpace, NTree } from 'naive-ui';
import { fetchAllMenuTree, fetchAssignMenusToRole, fetchRoleMenuIds } from '@/service/api/role';
import { $t } from '@/locales';

interface Props {
  /** role id */
  roleId: string;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', { default: false });

/** all menus */
const allMenus = ref<Api.SystemManage.Menu[]>([]);
/** checked menu ids */
const checkedKeys = ref<string[]>([]);

async function getAllMenus() {
  const { data, error } = await fetchAllMenuTree();
  if (!error && data) {
    allMenus.value = data.records;
  }
}

async function getRoleMenuIds() {
  if (!props.roleId) return;
  const { data, error } = await fetchRoleMenuIds(props.roleId);
  if (!error && data) {
    // only need leaf nodes for n-tree if cascade is enabled, but here we use simple array
    checkedKeys.value = data.map(item => item.id);
  }
}

async function handleSubmit() {
  if (!props.roleId) return;

  const { error } = await fetchAssignMenusToRole(props.roleId, checkedKeys.value);
  if (!error) {
    window.$message?.success($t('common.submitSuccess'));
    closeModal();
  }
}

function closeModal() {
  visible.value = false;
}

watch(visible, val => {
  if (val) {
    getAllMenus();
    getRoleMenuIds();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="$t('page.manage.role.menuPermission')" preset="card" class="w-480px">
    <NSpace vertical :size="16">
      <div class="h-400px overflow-y-auto border-1px border-[#efeff5] rounded-4px p-12px">
        <NTree
          v-model:checked-keys="checkedKeys"
          :data="allMenus"
          key-field="id"
          label-field="name"
          children-field="children"
          checkable
          expand-on-click
          :selectable="false"
          cascade
          default-expand-all
        />
      </div>
      <NSpace justify="end">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </NSpace>
  </NModal>
</template>

<style scoped></style>
