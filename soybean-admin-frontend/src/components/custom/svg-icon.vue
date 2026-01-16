<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Icon } from '@iconify/vue';

defineOptions({ name: 'SvgIcon', inheritAttrs: false });

/**
 * Props
 *
 * - Support iconify and local svg icon
 * - If icon and localIcon are passed at the same time, localIcon will be rendered first
 */
interface Props {
  /** Iconify icon name */
  icon?: string;
  /** Local svg icon name */
  localIcon?: string;
}

const props = defineProps<Props>();

const attrs = useAttrs();

const isGoogleIcon = computed(() => {
  if (props.localIcon || !props.icon) return false;
  if (props.icon.startsWith('local:')) return false;
  // If no colon, treat as Google Icon
  return !props.icon.includes(':');
});

const realLocalIcon = computed(() => {
  if (props.localIcon) return props.localIcon;
  if (props.icon?.startsWith('local:')) return props.icon.slice(6);
  return '';
});

const symbolId = computed(() => {
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env;
  return `#${prefix}-${realLocalIcon.value || 'no-icon'}`;
});

/** If localIcon is passed, render localIcon first */
const renderLocalIcon = computed(() => Boolean(realLocalIcon.value));
</script>

<template>
  <template v-if="renderLocalIcon">
    <svg aria-hidden="true" width="1em" height="1em" v-bind="attrs">
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </template>
  <template v-else-if="isGoogleIcon">
    <span v-if="icon" class="material-symbols-outlined h-1em w-1em flex-center text-icon" v-bind="attrs">
      {{ icon }}
    </span>
  </template>
  <template v-else>
    <Icon v-if="icon" :icon="icon" v-bind="attrs" />
  </template>
</template>

<style scoped>
.material-symbols-outlined {
  font-size: 1.5em;
  /* 稍微放大一点，因为字体图标视觉上比 SVG 小 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  width: 1em;
  height: 1em;
}
</style>
