<script setup lang="ts">
import { computed, reactive, ref, watch, h } from 'vue';
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
  NSpace,
  NSwitch,
  NTreeSelect,
  NAutoComplete
} from 'naive-ui';
import type { AutoCompleteOption } from 'naive-ui';
import { fetchCreateMenu, fetchMenuDetail, fetchMenuTree, fetchUpdateMenu } from '@/service/api/menu';
import { useRouteStore } from '@/store/modules/route';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';

interface Props {
  /** the type of operation */
  type: NaiveUI.TableOperateType;
  /** the edit data */
  editData: Api.SystemManage.Menu | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();
const routeStore = useRouteStore();

type Model = Omit<
  Pick<
    Api.SystemManage.Menu,
    | 'name'
    | 'parentId'
    | 'type'
    | 'path'
    | 'component'
    | 'icon'
    | 'permission'
    | 'sort'
    | 'status'
    | 'visible'
    | 'remark'
  >,
  'type' | 'status' | 'visible'
> & {
  type: '1' | '2' | '3';
  status: '1' | '0';
  visible: boolean;
  icon: string;
};

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    name: '',
    parentId: null,
    type: '1',
    path: '',
    component: '',
    icon: '',
    permission: '',
    sort: 1,
    status: '1',
    visible: true,
    remark: ''
  };
}

function parseMenuIcon(value: string) {
  const trimmed = (value || '').trim();
  return trimmed;
}

const currentIcon = computed(() => parseMenuIcon(model.icon || ''));

const googleIconNames = [
  'home',
  'settings',
  'person',
  'menu',
  'close',
  'search',
  'check',
  'delete',
  'add',
  'edit',
  'star',
  'favorite',
  'share',
  'more_vert',
  'more_horiz',
  'arrow_forward',
  'arrow_back',
  'expand_more',
  'expand_less',
  'visibility',
  'visibility_off',
  'warning',
  'info',
  'error',
  'help',
  'notifications',
  'mail',
  'call',
  'send',
  'download',
  'upload',
  'cloud',
  'wifi',
  'lock',
  'unlock',
  'key',
  'flag',
  'language',
  'calendar_today',
  'schedule',
  'location_on',
  'shopping_cart',
  'credit_card',
  'account_balance',
  'dashboard',
  'list',
  'grid_view',
  'view_list',
  'view_module',
  'view_quilt',
  'view_carousel',
  'view_column',
  'view_headline',
  'view_stream',
  'view_agenda',
  'view_day',
  'view_week',
  'view_sidebar'
];

const iconAutoCompleteOptions = computed(() => {
  const iconText = (model.icon || '').trim().toLocaleLowerCase();

  const options = googleIconNames
    .filter(name => name.includes(iconText))
    .map(name => ({
      label: name,
      value: name
    }));

  return options;
});

function renderAutoCompleteOption(info: { option: AutoCompleteOption }) {
  const { option } = info;
  const value = String(option.value ?? '');
  const label = String(option.label ?? value);

  const icon = parseMenuIcon(value);

  return h('div', { class: 'flex-y-center gap-8px' }, [
    h(SvgIcon, { icon, class: 'text-24px' }),
    h('span', null, label)
  ]);
}

const menuTree = ref<Api.SystemManage.Menu[]>([]);

async function getMenuTree() {
  const { data, error } = await fetchMenuTree();
  if (!error && data) {
    // Exclude current menu and its children when editing
    if (props.type === 'edit' && props.editData) {
      menuTree.value = filterCurrentMenu(data.records, props.editData.id);
    } else {
      menuTree.value = data.records;
    }
  }
}

function filterCurrentMenu(menus: Api.SystemManage.Menu[], currentId: string): Api.SystemManage.Menu[] {
  return menus
    .filter(item => item.id !== currentId)
    .map(item => {
      const newItem = { ...item };
      if (newItem.children) {
        newItem.children = filterCurrentMenu(newItem.children, currentId);
      }
      return newItem;
    });
}

const rules: Record<string, App.Global.FormRule[]> = {
  name: [defaultRequiredRule],
  type: [defaultRequiredRule],
  status: [defaultRequiredRule]
};

/** the title of the modal */
const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.menu.addMenu'),
    edit: $t('page.manage.menu.editMenu')
  };
  return titles[props.type];
});

async function handleSubmit() {
  await validate();

  // 构造提交数据，只包含后端 DTO 定义的字段，避免 forbidNonWhitelisted 报错
  const submitModel: any = {
    name: model.name,
    parentId: model.parentId && String(model.parentId).trim() !== '' ? model.parentId : null,
    type: Number(model.type),
    path: model.path,
    component: model.component,
    icon: model.icon,
    permission: model.permission,
    sort: Number(model.sort),
    status: Number(model.status),
    visible: model.visible ? 1 : 0,
    remark: model.remark
  };

  const { error } =
    props.type === 'add' ? await fetchCreateMenu(submitModel) : await fetchUpdateMenu(props.editData!.id, submitModel);

  if (!error) {
    window.$message?.success($t('common.submitSuccess'));
    closeModal();
    emit('submitted');

    // 更新菜单后刷新路由，以便侧边栏图标立即更新
    await routeStore.initAuthRoute();
  } else {
    window.$message?.error($t('common.error'));
  }
}

function closeModal() {
  visible.value = false;
}

// eslint-disable-next-line complexity
async function handleUpdateModelWhenEdit() {
  if (props.type === 'edit' && props.editData) {
    // 获取完整的菜单详情
    const { data: menuDetail, error } = await fetchMenuDetail(props.editData.id);
    if (!error && menuDetail) {
      Object.assign(model, {
        name: menuDetail.name ?? '',
        parentId: menuDetail.parentId ?? null,
        type: String(menuDetail.type) as '1' | '2' | '3',
        path: menuDetail.path ?? '',
        component: menuDetail.component ?? '',
        icon: menuDetail.icon ?? '',
        permission: menuDetail.permission ?? '',
        sort: menuDetail.sort ?? 1,
        status: menuDetail.status === null ? '1' : (String(menuDetail.status) as '1' | '0'),
        visible: String(menuDetail.visible) === '1',
        remark: menuDetail.remark ?? ''
      });
    } else {
      // 如果获取详情失败，使用表格数据
      Object.assign(model, {
        name: props.editData.name ?? '',
        parentId: props.editData.parentId ?? null,
        type: String(props.editData.type) as '1' | '2' | '3',
        path: props.editData.path ?? '',
        component: props.editData.component ?? '',
        icon: props.editData.icon ?? '',
        permission: props.editData.permission ?? '',
        sort: props.editData.sort ?? 1,
        status: props.editData.status === null ? '1' : (String(props.editData.status) as '1' | '0'),
        visible: String(props.editData.visible) === '1',
        remark: props.editData.remark ?? ''
      });
    }
  } else if (props.type === 'add' && props.editData) {
    // This is for "Add child menu"
    Object.assign(model, createDefaultModel());
    model.parentId = props.editData.id || props.editData.parentId;
  } else {
    Object.assign(model, createDefaultModel());
  }
}

watch(visible, async () => {
  if (visible.value) {
    await handleUpdateModelWhenEdit();
    restoreValidation();
    getMenuTree();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-800px">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
      <NGrid :cols="24" :x-gap="18">
        <NFormItemGi :span="24" :label="$t('page.manage.menu.menuType')" path="type">
          <NRadioGroup v-model:value="model.type">
            <NRadio value="1">{{ $t('page.manage.menu.type.directory') }}</NRadio>
            <NRadio value="2">{{ $t('page.manage.menu.type.menu') }}</NRadio>
            <NRadio value="3">{{ $t('page.manage.menu.type.button') }}</NRadio>
          </NRadioGroup>
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.manage.menu.menuName')" path="name">
          <NInput v-model:value="model.name" :placeholder="$t('page.manage.menu.form.menuName')" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.manage.menu.parentMenu')" path="parentId">
          <NTreeSelect
            v-model:value="model.parentId"
            :options="menuTree"
            key-field="id"
            label-field="name"
            children-field="children"
            :placeholder="$t('page.manage.menu.form.parentMenu')"
            clearable
          />
        </NFormItemGi>
        <NFormItemGi v-if="model.type !== '3'" :span="12" :label="$t('page.manage.menu.routePath')" path="path">
          <NInput v-model:value="model.path" :placeholder="$t('page.manage.menu.form.routePath')" />
        </NFormItemGi>
        <NFormItemGi v-if="model.type === '2'" :span="12" :label="$t('page.manage.menu.component')" path="component">
          <NInput v-model:value="model.component" :placeholder="$t('page.manage.menu.form.component')" />
        </NFormItemGi>
        <NFormItemGi v-if="model.type !== '3'" :span="12" :label="$t('page.manage.menu.icon')" path="icon">
          <NAutoComplete
            v-model:value="model.icon"
            :options="iconAutoCompleteOptions"
            :placeholder="$t('page.manage.menu.form.icon')"
            :render-option="renderAutoCompleteOption"
            clearable
          >
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <NInput
                :value="model.icon"
                :placeholder="$t('page.manage.menu.form.icon')"
                @input="
                  val => {
                    model.icon = val;
                    handleInput(val);
                  }
                "
                @focus="handleFocus"
                @blur="handleBlur"
              >
                <template #suffix>
                  <SvgIcon v-if="currentIcon" :icon="currentIcon" class="text-30px" />
                </template>
              </NInput>
            </template>
          </NAutoComplete>
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.manage.menu.permission')" path="permission">
          <NInput v-model:value="model.permission" :placeholder="$t('page.manage.menu.form.permission')" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.manage.menu.menuSort')" path="sort">
          <NInputNumber v-model:value="model.sort" class="w-full" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.manage.menu.menuStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio value="1">{{ $t('page.manage.menu.status.enable') }}</NRadio>
            <NRadio value="0">{{ $t('page.manage.menu.status.disable') }}</NRadio>
          </NRadioGroup>
        </NFormItemGi>
        <NFormItemGi v-if="model.type !== '3'" :span="12" :label="$t('page.manage.menu.visible')" path="visible">
          <NSwitch v-model:value="model.visible" />
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.menu.remark')" path="remark">
          <NInput v-model:value="model.remark" type="textarea" :placeholder="$t('page.manage.menu.form.remark')" />
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
