import GaragesPage from '@/@presentation/@modules/garages/pages/GaragesPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const garageRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/garages',
    name: 'Garages',
    component: GaragesPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Garages', href: '/organization/garages' },
      ]
    },
  },
];
