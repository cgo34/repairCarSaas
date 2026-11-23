// src/router/modules/carSettings/carSettingsRoutes.ts
import DashboardPage from '@/features/dashboard/presentation/views/DashboardPageExemple.vue';
import CarBodyMaterialPage from '@/features/carRepairSettings/presentation/views/CarBodyMaterialPage.vue';
import CarBodyPartPage from '@/features/carRepairSettings/presentation/views/CarBodyPartPage.vue';
import DentRepairTypePage from '@/features/carRepairSettings/presentation/views/DentRepairTypePage.vue';
import { RouteRecordRaw } from 'vue-router';

export const carSettingsRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/settings/car-body-parts',
    name: 'CarBodyPartsList',
    component: CarBodyPartPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/organization/settings' },
        { title: 'Car Body Parts', href: '/organization/settings/car-body-parts' }
      ]
    }
  },
  {
    path: '/organization/settings/car-body-parts/:id',
    name: 'CarBodyPartDetail',
    component: DashboardPage,
  },
  {
    path: '/organization/settings/car-body-materials',
    name: 'CarBodyMaterialsList',
    component: CarBodyMaterialPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/organization/settings' },
        { title: 'Car Body Materials', href: '/organization/settings/car-body-materials' }
      ]
    }
  },
  {
    path: '/organization/settings/car-body-materials/:id',
    name: 'CarBodyMaterialDetail',
    component: DashboardPage,
  },
  {
    path: '/organization/settings/dent-repair-types',
    name: 'DentRepairTypesList',
    component: DentRepairTypePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/organization/settings' },
        { title: 'Dent Repair Types', href: '/organization/settings/dent-repair-types' }
      ]
    }
  },
  {
    path: '/organization/settings/dent-repair-types/:id',
    name: 'DentRepairTypeDetail',
    component: DashboardPage,
  },
];
