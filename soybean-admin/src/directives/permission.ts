import type { App, Directive } from 'vue';
import { useAuthStore } from '@/store/modules/auth';

export default function setupPermissionDirective(app: App) {
  const authStore = useAuthStore();

  const permission: Directive<HTMLElement, string | string[]> = {
    mounted(el, binding) {
      const { value } = binding;

      if (value) {
        const permissions = Array.isArray(value) ? value : [value];

        const hasPermission = authStore.userInfo.buttons.some(item => permissions.includes(item));

        if (!hasPermission) {
          el.parentNode?.removeChild(el);
        }
      }
    }
  };

  app.directive('permission', permission);
}
