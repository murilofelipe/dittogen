import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pt from './locales/pt.json'

const userLang = navigator.language.split('-')[0];
const defaultLang = userLang === 'pt' ? 'pt' : 'en';

export const i18n = createI18n({
  legacy: false, // For Composition API
  locale: defaultLang,
  fallbackLocale: 'en',
  messages: {
    en,
    pt
  }
})
