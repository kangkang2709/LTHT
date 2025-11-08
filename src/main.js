import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index.js";
import Vue3ConfirmDialog from 'vue3-confirm-dialog';
import 'vue3-confirm-dialog/style';
import './assets/main.css';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';




createApp(App)
    .use(Vue3ConfirmDialog)
    .use(router)
    .use(ToastPlugin)
    .mount("#app");
