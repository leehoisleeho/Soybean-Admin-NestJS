<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import {
  NButton,
  NForm,
  NFormItemGi,
  NGrid,
  NInput,
  NInputNumber,
  NModal,
  NRadio,
  NRadioGroup,
  NSpace
} from 'naive-ui';
import { fetchCreateRole, fetchUpdateRole } from '@/service/api/role';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

interface Props {
  /** the type of operation */
  type: NaiveUI.TableOperateType;
  /** the edit data */
  editData: Api.SystemManage.Role | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

type Model = Pick<Api.SystemManage.Role, 'name' | 'code' | 'status' | 'sort' | 'remark'>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    code: '',
    status: '1',
    sort: 1,
    remark: ''
  };
}

type RuleKey = keyof Model;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  name: [defaultRequiredRule],
  code: [defaultRequiredRule],
  status: [defaultRequiredRule],
  sort: [defaultRequiredRule],
  remark: []
};

/** the title of the modal */
const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.type];
});

async function handleSubmit() {
  await validate();

  const { error } =
    props.type === 'add' ? await fetchCreateRole(model) : await fetchUpdateRole(props.editData!.id, model);

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
    model.name = props.editData.name;
    model.code = props.editData.code;
    model.status =
      props.editData.status === null ? '1' : (String(props.editData.status) as Api.SystemManage.UserStatus);
    model.sort = props.editData.sort;
    model.remark = props.editData.remark;
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
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
      <NGrid :cols="24" :x-gap="18">
        <NFormItemGi :span="24" :label="$t('page.manage.role.roleName')" path="name">
          <NInput v-model:value="model.name" :placeholder="$t('page.manage.role.form.roleName')" />
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.role.roleCode')" path="code">
          <NInput v-model:value="model.code" :placeholder="$t('page.manage.role.form.roleCode')" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.manage.role.roleStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio value="1">{{ $t('page.manage.role.status.enable') }}</NRadio>
            <NRadio value="0">{{ $t('page.manage.role.status.disable') }}</NRadio>
          </NRadioGroup>
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.manage.role.roleSort')" path="sort">
          <NInputNumber v-model:value="model.sort" class="w-full" />
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.role.remark')" path="remark">
          <NInput v-model:value="model.remark" type="textarea" :placeholder="$t('page.manage.role.form.remark')" />
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
