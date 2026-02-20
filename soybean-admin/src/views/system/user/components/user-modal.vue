<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { NButton, NForm, NFormItemGi, NGrid, NInput, NModal, NRadio, NRadioGroup, NSpace } from 'naive-ui';
import { fetchCreateUser, fetchUpdateUser } from '@/service/api/user';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

interface Props {
  type: NaiveUI.TableOperateType;
  editData: Api.SystemManage.User | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule, formRules } = useFormRules();

interface Model {
  username: string;
  password: string;
  nickname: string;
  email: string;
  phone: string;
  status: Api.SystemManage.UserStatus;
  remark: string;
  roleIds: string[];
}

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    username: '',
    password: '',
    nickname: '',
    email: '',
    phone: '',
    status: '1',
    remark: '',
    roleIds: []
  };
}

type RuleKey = keyof Model;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  username: [defaultRequiredRule, ...formRules.userName],
  password: props.type === 'add' ? [defaultRequiredRule, ...formRules.pwd] : [],
  nickname: [],
  email: [...formRules.email],
  phone: [...formRules.phone],
  status: [defaultRequiredRule],
  remark: [],
  roleIds: []
};

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.type];
});

async function handleSubmit() {
  await validate();

  const { error } =
    props.type === 'add' ? await fetchCreateUser(model) : await fetchUpdateUser(props.editData!.id, model);

  if (!error) {
    window.$message?.success($t('common.submitSuccess'));
    closeModal();
    emit('submitted');
  }
}

function closeModal() {
  visible.value = false;
}

function handleUpdateModelWhenEdit() {
  if (props.type === 'edit' && props.editData) {
    model.username = props.editData.username;
    model.nickname = props.editData.nickname;
    model.email = props.editData.email;
    model.phone = props.editData.phone;
    model.status =
      props.editData.status === null ? '1' : (String(props.editData.status) as Api.SystemManage.UserStatus);
    model.remark = props.editData.remark;
    model.roleIds = props.editData.roles?.map(role => role.id) ?? [];
  } else {
    Object.assign(model, createDefaultModel());
  }
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-600px">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
      <NGrid :cols="24" :x-gap="18">
        <NFormItemGi :span="24" :label="$t('page.manage.user.userName')" path="username">
          <NInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.userName')" />
        </NFormItemGi>
        <NFormItemGi v-if="type === 'add'" :span="24" :label="$t('page.manage.user.userPassword')" path="password">
          <NInput
            v-model:value="model.password"
            type="password"
            :placeholder="$t('page.manage.user.form.userPassword')"
          />
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.user.nickName')" path="nickname">
          <NInput v-model:value="model.nickname" :placeholder="$t('page.manage.user.form.nickName')" />
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.user.userEmail')" path="email">
          <NInput v-model:value="model.email" :placeholder="$t('page.manage.user.form.userEmail')" />
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.user.userPhone')" path="phone">
          <NInput v-model:value="model.phone" :placeholder="$t('page.manage.user.form.userPhone')" />
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.user.userStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio value="1">{{ $t('page.manage.user.status.enable') }}</NRadio>
            <NRadio value="0">{{ $t('page.manage.user.status.disable') }}</NRadio>
          </NRadioGroup>
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.user.remark')" path="remark">
          <NInput v-model:value="model.remark" type="textarea" :placeholder="$t('page.manage.user.form.remark')" />
        </NFormItemGi>
      </NGrid>
      <NSpace justify="end">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>

<style scoped></style>
