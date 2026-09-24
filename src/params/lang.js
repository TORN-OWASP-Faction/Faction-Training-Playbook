import { isLocale } from '$lib/i18n';

export const match = (param) => param !== 'en' && isLocale(param);
