<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
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
  NScrollbar,
  NSpace,
  NSwitch,
  NTreeSelect
} from 'naive-ui';
import { fetchCreateMenu, fetchMenuDetail, fetchMenuTree, fetchUpdateMenu } from '@/service/api/menu';
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

const LOCAL_ICON_PREFIX = 'local:';

function parseMenuIcon(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { icon: '', localIcon: '' };
  if (trimmed.startsWith(LOCAL_ICON_PREFIX)) {
    return { icon: '', localIcon: trimmed.slice(LOCAL_ICON_PREFIX.length) };
  }
  return { icon: trimmed, localIcon: '' };
}

const currentIconConfig = computed(() => parseMenuIcon(model.icon || ''));

const iconPickerVisible = ref(false);
const iconKeyword = ref('');

const localSvgModules = import.meta.glob('/src/assets/svg-icon/*.svg', { eager: true });

function getFileBaseName(filePath: string) {
  const filename = filePath.split('/').pop() || filePath;
  return filename.replace(/\.svg$/i, '');
}

const localIconOptions = computed(() => {
  const names = Object.keys(localSvgModules).map(getFileBaseName);
  const unique = Array.from(new Set(names));
  return unique.sort((a, b) => {
    const aIsGoogle = a.startsWith('google-');
    const bIsGoogle = b.startsWith('google-');
    if (aIsGoogle !== bIsGoogle) return aIsGoogle ? -1 : 1;
    return a.localeCompare(b);
  });
});

const filteredLocalIconOptions = computed(() => {
  const keyword = iconKeyword.value.trim().toLocaleLowerCase();
  if (!keyword) return localIconOptions.value;
  return localIconOptions.value.filter(name => name.toLocaleLowerCase().includes(keyword));
});

function openIconPicker() {
  iconPickerVisible.value = true;
  iconKeyword.value = '';
}

function closeIconPicker() {
  iconPickerVisible.value = false;
}

function handleSelectLocalIcon(name: string) {
  model.icon = `${LOCAL_ICON_PREFIX}${name}`;
  closeIconPicker();
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

  const { error } =
    props.type === 'add' ? await fetchCreateMenu(model) : await fetchUpdateMenu(props.editData!.id, model);

  if (!error) {
    window.$message?.success($t('common.submitSuccess'));
    closeModal();
    emit('submitted');
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
    model.parentId = props.editData.parentId;
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
          <NInput
            v-model:value="model.icon"
            :placeholder="$t('page.manage.menu.form.icon')"
            readonly
            clearable
            class="cursor-pointer"
            @click="openIconPicker"
          >
            <template #prefix>
              <SvgIcon
                v-if="model.icon"
                :icon="currentIconConfig.icon"
                :local-icon="currentIconConfig.localIcon"
                class="text-icon"
              />
            </template>
          </NInput>
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

  <NModal v-model:show="iconPickerVisible" preset="card" :title="$t('page.manage.menu.icon')" class="w-720px">
    <div class="flex-col-stretch gap-12px">
      <NInput v-model:value="iconKeyword" :placeholder="$t('common.keywordSearch')" clearable>
        <template #prefix>
          <SvgIcon icon="ic:round-search" class="text-15px text-#c2c2c2" />
        </template>
      </NInput>
      <div class="h-420px overflow-hidden border-1px border-#efeff5 rounded-6px dark:border-#ffffff1a">
        <NScrollbar class="h-full">
          <div class="grid grid-cols-8 gap-8px p-12px lt-sm:grid-cols-4">
            <div
              v-for="name in filteredLocalIconOptions"
              :key="name"
              class="flex-col-center cursor-pointer gap-6px rounded-6px p-8px transition-200 hover:bg-#f3f4f6 dark:hover:bg-#ffffff14"
              @click="handleSelectLocalIcon(name)"
            >
              <SvgIcon :local-icon="name" class="text-22px" />
              <div class="w-full truncate text-center text-12px text-#606266 dark:text-#ffffffa6">
                {{ name }}
              </div>
            </div>
          </div>
        </NScrollbar>
      </div>
      <NSpace justify="end">
        <NButton @click="closeIconPicker">{{ $t('common.close') }}</NButton>
      </NSpace>
    </div>
  </NModal>
</template>

<style scoped></style>
