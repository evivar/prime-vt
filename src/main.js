import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService  from 'primevue/toastservice';

import axios from 'axios';

import App from './App.vue'
import router from './router'

import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import es from './locales/es.json'

const i18n = createI18n({
  locale: 'en', // idioma predeterminado
  fallbackLocale: 'en', // idioma de respaldo
  messages: {
    en,
    es
  }
})

axios.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_AIR_TABLE_API_KEY}`;

const app = createApp(App)

app.config.globalProperties.$axios = axios;

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);
app.use(i18n)

app.mount('#app')
