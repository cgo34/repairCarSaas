// src/router/modules/carBodyMaterialsRoutes.ts
import DashboardPage from '@/@presentation/@modules/dashboard/pages/DashboardPage.vue';
import { RouteRecordRaw } from 'vue-router';


export const carBodyMaterialsRoutes: RouteRecordRaw[] = [
  {
    path: '/car-body-materials',
    name: 'CarBodyMaterialsList',
    component: DashboardPage,
  },
  {
    path: '/car-body-materials/:id',
    name: 'CarBodyMaterialDetail',
    component: DashboardPage,
  },
];