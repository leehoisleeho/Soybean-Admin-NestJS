<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { formRef, validate } = useNaiveForm();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: '',
  password: ''
});

const rememberMe = ref(Boolean(localStg.get('loginRemember')));

if (rememberMe.value) {
  model.userName = localStg.get('loginUserName') || '';
}

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

async function handleSubmit() {
  await validate();
  if (rememberMe.value) {
    localStg.set('loginRemember', true);
    localStg.set('loginUserName', model.userName);
  } else {
    localStg.remove('loginRemember');
    localStg.remove('loginUserName');
  }
  await authStore.login(model.userName, model.password, { redirect: true, rememberMe: rememberMe.value });
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="userName">
      <NInput
        v-model:value="model.userName"
        :placeholder="$t('page.login.common.userNamePlaceholder')"
        class="rd-4px"
        autocomplete="off"
      />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
        class="rd-4px"
        autocomplete="off"
      />
    </NFormItem>
    <div class="pb-14px">
      <NCheckbox v-model:checked="rememberMe">{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
    </div>
    <NButton
      type="primary"
      size="large"
      block
      :loading="authStore.loginLoading"
      class="h-44px rd-10px font-600"
      @click="handleSubmit"
    >
      {{ $t('common.confirm') }}
    </NButton>
  </NForm>
</template>

<style scoped></style>
