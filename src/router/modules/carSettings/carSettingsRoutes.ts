// src/router/modules/carSettings/carSettingsRoutes.ts
import DashboardPage from '@/@presentation/@modules/dashboard/pages/DashboardPage.vue';
import CarBodyPartPage from '@/@presentation/@modules/settings/carRepair/pages/CarBodyPartPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const carSettingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings/car-body-parts',
    name: 'CarBodyPartsList',
    component: CarBodyPartPage,
    meta: {
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings' },
        { title: 'Car Body Parts', href: '/car-body-parts' }
      ]
    }
  },
  {
    path: '/car-body-parts/:id',
    name: 'CarBodyPartDetail',
    component: DashboardPage,
  },
  {
    path: '/car-body-materials',
    name: 'CarBodyMaterialsList',
    component: CarBodyPartPage,
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