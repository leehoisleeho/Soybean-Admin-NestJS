<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { NButton, NForm, NFormItem, NInput, NModal, NSpace } from 'naive-ui';
import { fetchResetPassword } from '@/service/api/user';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
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

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule, formRules, createConfirmPwdRule } = useFormRules();

interface FormModel {
  password: string;
  confirmPassword: string;
}

const model: FormModel = reactive({
  password: '',
  confirmPassword: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  return {
    password: [defaultRequiredRule, ...formRules.pwd],
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

const title = computed(() => $t('page.manage.user.resetPassword'));

async function handleSubmit() {
  await validate();

  const { error } = await fetchResetPassword(props.userId, { password: model.password });

  if (!error) {
    window.$message?.success($t('common.submitSuccess'));
    closeModal();
    emit('submitted');
  }
}

function closeModal() {
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    model.password = '';
    model.confirmPassword = '';
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-500px">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="120">
      <NFormItem :label="$t('page.manage.user.newPassword')" path="password">
        <NInput
          v-model:value="model.password"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.manage.user.form.newPassword')"
        />
      </NFormItem>
      <NFormItem :label="$t('page.manage.user.confirmPassword')" path="confirmPassword">
        <NInput
          v-model:value="model.confirmPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.manage.user.form.confirmPassword')"
        />
      </NFormItem>
    </NForm>
    <NSpace justify="end" class="mt-16px">
      <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
      <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
    </NSpace>
  </NModal>
</template>

<style scoped></style>
