import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService  from 'primevue/toastservice';

import axios from 'axios';

import App from './App.vue'
import router from './router'

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

app.mount('#app')
