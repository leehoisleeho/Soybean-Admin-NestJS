import { locale } from 'dayjs';
import 'dayjs/locale/zh-cn';

/**
 * Set dayjs locale
 *
 * @param lang
 */
export function setDayjsLocale(lang: App.I18n.LangType = 'zh-CN') {
  locale(lang === 'zh-CN' ? 'zh-cn' : 'zh-cn');
}
