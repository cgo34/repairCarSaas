// src/router/modules/carSettings/carSettingsRoutes.ts
import DashboardPage from '@/@presentation/@modules/dashboard/pages/DashboardPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const carSettingsRoutes: RouteRecordRaw[] = [
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
  {
    path: '/dent-removal-pricing',
    name: 'DentRemovalPricingList',
    component: DashboardPage,
  },
  {
    path: '/dent-removal-pricing/:id',
    name: 'DentRemovalPricingDetail',
    component: DashboardPage,
  },
];