// IoC
import { container } from '@infrastructure/ioc/inversify.config';
import 'reflect-metadata';
import { createApp } from 'vue';
import VueTablerIcons from 'vue-tabler-icons';
import VueApexCharts from 'vue3-apexcharts';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import App from './App.vue';

// Plugins & configuration
import vuetify from '@plugins/vuetify';
import router from '@router/index';

// import { initAuth } from '@plugins/auth';

// Styles globaux
import '@mdi/font/css/materialdesignicons.css';
import '@ui/styles/main.scss';
import '@/scss/style.scss';

const app = createApp(App);

// Initialiser l'auth avant le router
// await initAuth();
app.provide('container', container);
app.use(router);
app.use(PerfectScrollbarPlugin);
app.use(VueTablerIcons);
app.use(VueApexCharts);
app.use(vuetify);

app.mount('#app');