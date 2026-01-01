<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NButton, NCard, NCheckbox, NCheckboxGroup, NModal, NSpace } from 'naive-ui';
import { fetchAllRoles, fetchAssignRoles, fetchUserDetail } from '@/service/api/user';
import { $t } from '@/locales';

interface Props {
  userId: string;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const allRoles = ref<Api.SystemManage.Role[]>([]);
const selectedRoleIds = ref<string[]>([]);
const loading = ref(false);

const title = computed(() => $t('page.manage.user.assignRole'));

async function fetchRoles() {
  loading.value = true;
  try {
    const { data } = await fetchAllRoles();
    if (data) {
      allRoles.value = data.records || [];
    }
  } finally {
    loading.value = false;
  }
}

async function fetchUserRoles() {
  if (!props.userId) return;

  loading.value = true;
  try {
    const { data } = await fetchUserDetail(props.userId);
    if (data && data.roles) {
      selectedRoleIds.value = data.roles.map((role: Api.SystemManage.Role) => role.id);
    } else {
      selectedRoleIds.value = [];
    }
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  if (!props.userId) return;

  const { error } = await fetchAssignRoles(props.userId, selectedRoleIds.value);

  if (!error) {
    window.$message?.success($t('common.submitSuccess'));
    closeModal();
    emit('submitted');
  }
}

function closeModal() {
  visible.value = false;
}

watch(visible, async () => {
  if (visible.value) {
    await fetchRoles();
    await fetchUserRoles();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-500px">
    <NCard v-if="allRoles.length > 0" :bordered="false" size="small">
      <NCheckboxGroup v-model:value="selectedRoleIds">
        <NSpace vertical>
          <NCheckbox v-for="role in allRoles" :key="role.id" :value="role.id" :label="role.name" />
        </NSpace>
      </NCheckboxGroup>
    </NCard>
    <NCard v-else :bordered="false" size="small">
      <div class="text-center text-gray-400">{{ $t('common.noData') }}</div>
    </NCard>
    <NSpace justify="end" class="mt-16px">
      <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
      <NButton type="primary" :loading="loading" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
    </NSpace>
  </NModal>
</template>

<style scoped></style>
