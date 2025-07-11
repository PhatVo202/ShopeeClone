import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const currentLanguages = {
  en: 'English',
  vi: 'Tiếng Việt'
}

const resources = {
  en: {
    translation: {
      'all categories': 'All Categories',
      'filter search': 'Filter search'
    }
  },
  vi: {
    translation: {
      'all categories': 'Tất cả danh mục ',
      'filter search': 'Bộ lọc tìm kiếm'
    }
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })
