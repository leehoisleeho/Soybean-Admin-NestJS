import type { App } from 'vue';
import setupPermissionDirective from './permission';

/** setup custom directives */
export function setupDirectives(app: App) {
  setupPermissionDirective(app);
}
