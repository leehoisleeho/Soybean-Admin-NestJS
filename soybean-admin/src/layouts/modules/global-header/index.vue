<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalLogo from '../global-logo/index.vue';
import GlobalBreadcrumb from '../global-breadcrumb/index.vue';
import GlobalSearch from '../global-search/index.vue';
import ThemeButton from './components/theme-button.vue';
import UserAvatar from './components/user-avatar.vue';

defineOptions({
  name: 'GlobalHeader'
});

interface Props {
  /** Whether to show the logo */
  showLogo?: App.Global.HeaderProps['showLogo'];
  /** Whether to show the menu toggler */
  showMenuToggler?: App.Global.HeaderProps['showMenuToggler'];
  /** Whether to show the menu */
  showMenu?: App.Global.HeaderProps['showMenu'];
}

defineProps<Props>();

const appStore = useAppStore();
const themeStore = useThemeStore();
const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <DarkModeContainer class="h-full flex-y-center px-12px shadow-header">
    <GlobalLogo
      v-if="showLogo"
      class="h-full"
      :collapsed="themeStore.sider.width <= 96"
      :style="{ width: themeStore.sider.width + 'px' }"
    />
    <MenuToggler v-if="showMenuToggler" :collapsed="appStore.siderCollapse" @click="appStore.toggleSiderCollapse" />
    <div v-if="showMenu" :id="GLOBAL_HEADER_MENU_ID" class="h-full flex-y-center flex-1-hidden"></div>
    <div v-else class="h-full flex-y-center flex-1-hidden">
      <GlobalBreadcrumb v-if="!appStore.isMobile" class="ml-12px" />
    </div>
    <div class="h-full flex-y-center justify-end">
      <GlobalSearch v-if="themeStore.header.globalSearch.visible" />
      <FullScreen
        v-if="themeStore.header.fullScreen.visible && !appStore.isMobile"
        :full="isFullscreen"
        @click="toggle"
      />
      <ThemeSchemaSwitch
        v-if="themeStore.header.themeSchema.visible"
        :theme-schema="themeStore.themeScheme"
        :is-dark="themeStore.darkMode"
        @switch="themeStore.toggleThemeScheme"
      />
      <ThemeButton v-if="themeStore.header.themeButton.visible" />
      <UserAvatar />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
