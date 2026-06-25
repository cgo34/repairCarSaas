import WeatherPage from '@/@presentation/@modules/weather/pages/WeatherPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const weatherRoutes: RouteRecordRaw[] = [
  {
    path: '/weather',
    name: 'Weather',
    component: WeatherPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Surveillance grêle', href: '/weather' },
      ]
    },
  },
];
