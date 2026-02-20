<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { useThemeStore } from '@/store/modules/theme';
import logo from '@/assets/imgs/logo.png';
import PwdLogin from './modules/pwd-login.vue';

defineOptions({
  name: 'LoginPage'
});

interface Props {
  /** The login module */
  module: UnionKey.LoginModule;
}

const props = defineProps<Props>();

const themeStore = useThemeStore();

interface LoginModule {
  label: App.I18n.I18nKey;
  component: Component;
}

const activeModule = computed<LoginModule>(() => {
  const active: LoginModule = {
    label: loginModuleRecord[props.module] || loginModuleRecord['pwd-login'],
    component: PwdLogin
  };
  return active;
});
</script>

<template>
  <div class="relative size-full flex-center overflow-hidden bg-[#f0f2f5] dark:bg-[#08080a]">
    <!-- Google 经典配色装饰球 -->
    <div class="pointer-events-none absolute z-1 h-screen w-screen overflow-hidden">
      <!-- 蓝色球 - 左上 -->
      <div class="animate-float-slow absolute size-400px bg-[#4285F4] opacity-35 blur-100px -left-5% -top-5%"></div>
      <!-- 红色球 - 右上 -->
      <div class="animate-float absolute top-10% size-350px bg-[#EA4335] opacity-30 blur-90px -right-5%"></div>
      <!-- 黄色球 - 左下 -->
      <div
        class="animate-float-delayed absolute left-10% size-300px bg-[#FBBC05] opacity-30 blur-80px -bottom-10%"
      ></div>
      <!-- 绿色球 - 右下 -->
      <div
        class="animate-float-slow absolute size-450px bg-[#34A853] opacity-30 blur-110px -bottom-5% -right-10%"
      ></div>
    </div>

    <!-- 极简背景蒙层 -->
    <div class="absolute inset-0 z-2 backdrop-blur-100px dark:bg-black/20"></div>

    <div class="absolute left-24px top-20px z-4 flex-y-center gap-14px lt-sm:left-14px lt-sm:top-14px">
      <img :src="logo" class="size-56px object-cover" />
      <div class="text-18px text-[#202124] font-800 tracking-tight lt-sm:text-16px dark:text-white">
        {{ $t('system.title') }}
      </div>
    </div>

    <NCard
      :bordered="false"
      class="relative z-4 w-450px border border-white/40 rd-24px bg-white/60 shadow-2xl backdrop-blur-2xl lt-sm:w-300px dark:border-white/10 dark:bg-dark/60"
    >
      <!-- 顶部分段色条 (Google 四色) -->
      <div class="absolute left-0 top-0 h-4px w-full flex overflow-hidden rd-t-24px">
        <div class="h-full w-1/4 bg-[#4285F4]"></div>
        <div class="h-full w-1/4 bg-[#EA4335]"></div>
        <div class="h-full w-1/4 bg-[#FBBC05]"></div>
        <div class="h-full w-1/4 bg-[#34A853]"></div>
      </div>

      <div class="px-32px py-36px lt-sm:px-20px lt-sm:py-28px">
        <main class="enter-y pt-10px">
          <div class="mb-18px">
            <h3 class="text-20px text-[#202124] font-600 tracking-tight dark:text-white">
              {{ $t('page.login.common.loginTitle') }}
            </h3>
            <p class="pt-6px text-14px text-gray-600 leading-20px dark:text-gray-300">
              {{ $t('page.login.common.loginSubtitle') }}
            </p>
          </div>
          <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
            <component :is="activeModule.component" />
          </Transition>
        </main>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.enter-y {
  animation: enter-y 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes enter-y {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 12s ease-in-out infinite;
}

.animate-float-slow {
  animation: float 18s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 15s ease-in-out infinite -4s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 40px) scale(0.9);
  }
}
</style>
