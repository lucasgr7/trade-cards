import { createApp } from 'vue'
import {createPinia} from 'pinia';
import './style.css'
import App from './App.vue'
import './assets/tailwind.css'
import router from './util/router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
const app = createApp(App);

pinia.use(piniaPluginPersistedstate);

app.use(router)
.use(pinia)
.mount('#app')
