// src/router/modules/carBodyPartsRoutes.ts
import DashboardPage from '@/@presentation/@modules/dashboard/pages/DashboardPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const carBodyPartsRoutes: RouteRecordRaw[] = [
  {
    path: '/car-body-parts',
    name: 'CarBodyPartsList',
    component: DashboardPage,
  },
  {
    path: '/car-body-parts/:id',
    name: 'CarBodyPartDetail',
    component: DashboardPage,
  },
];