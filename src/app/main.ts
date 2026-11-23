// IoC
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { DOWNLOAD_SERVICE_KEY } from '@/shared/presentation/injectionKeys';
import { IDownloadService } from '@/shared/application/ports/IDownloadService';
import { registerCompanyProfileDependencies } from '@/features/account/composition/useCompanyProfile';
import 'reflect-metadata';
import { createApp } from 'vue';
import VueTablerIcons from 'vue-tabler-icons';
import VueApexCharts from 'vue3-apexcharts';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import App from './App.vue';

// Plugins & configuration
import vuetify from '@/app/plugins/vuetify';
import router from '@/app/router/index';

// import { initAuth } from '@/app/plugins/auth';

// Styles globaux
import '@mdi/font/css/materialdesignicons.css';
import '@/shared/presentation/ui/styles/main.scss';
import '@/assets/scss/style.scss';

const app = createApp(App);

// Initialiser l'auth avant le router
// await initAuth();
app.provide(DOWNLOAD_SERVICE_KEY, container.get<IDownloadService>(SYMBOLS.Services.DownloadService));
registerCompanyProfileDependencies();
app.use(router);
app.use(PerfectScrollbarPlugin);
app.use(VueTablerIcons);
app.use(VueApexCharts);
app.use(vuetify);

app.mount('#app');