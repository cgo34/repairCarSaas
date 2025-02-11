// src/router/modules/dentRepairTypesRoutes.ts
import DashboardPage from '@/@presentation/@modules/dashboard/pages/DashboardPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const dentRepairTypesRoutes: RouteRecordRaw[] = [
  {
    path: '/dent-repair-types',
    name: 'DentRepairTypesList',
    component: DashboardPage,
  },
  {
    path: '/dent-repair-types/:id',
    name: 'DentRepairTypeDetail',
    component: DashboardPage,
  },
];