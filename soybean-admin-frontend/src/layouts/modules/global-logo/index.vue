<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'GlobalLogo'
});

interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
  collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTitle: true,
  collapsed: false
});

const wrapperClass = computed(() =>
  props.collapsed
    ? 'w-full flex-col-center px-4px'
    : 'w-full flex items-center overflow-hidden whitespace-nowrap pl-16px pr-8px'
);

const titleClass = computed(() =>
  props.collapsed
    ? 'pt-4px text-center text-12px text-primary font-bold leading-14px transition duration-300 ease-in-out break-words'
    : 'pl-10px text-15px text-primary font-bold transition duration-300 ease-in-out'
);

const showTitleComputed = computed(() => props.showTitle && !props.collapsed);
</script>

<template>
  <RouterLink to="/" :class="wrapperClass">
    <SystemLogo class="size-32px flex-shrink-0" />
    <h2 v-show="showTitleComputed" :class="titleClass">
      {{ $t('system.title') }}
    </h2>
  </RouterLink>
</template>

<style scoped></style>
