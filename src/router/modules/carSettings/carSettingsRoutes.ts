// src/router/modules/carSettings/carSettingsRoutes.ts
import DashboardPage from '@/@presentation/@modules/dashboard/pages/DashboardPageExemple.vue';
import CarBodyMaterialPage from '@/@presentation/@modules/settings/carRepair/pages/CarBodyMaterialPage.vue';
import CarBodyPartPage from '@/@presentation/@modules/settings/carRepair/pages/CarBodyPartPage.vue';
import DentRepairTypePage from '@/@presentation/@modules/settings/carRepair/pages/DentRepairTypePage.vue';
import SettingPriceBodyPartCoefficientPage from '@/@presentation/@modules/settings/price/pages/SettingPriceBodyPartCoefficientPage.vue';
import SettingPriceGeneralPage from '@/@presentation/@modules/settings/price/pages/SettingPriceGeneralPage.vue';
import SettingPriceImpactCountToUtPage from '@/@presentation/@modules/settings/price/pages/SettingPriceImpactCountToUtPage.vue';
import SettingPriceRepairTypeCoefficientPage from '@/@presentation/@modules/settings/price/pages/SettingPriceRepairTypeCoefficientPage.vue';
import SettingPriceTechnicityCoefficientPage from '@/@presentation/@modules/settings/price/pages/SettingPriceTechnicityCoefficientPage.vue';
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
  // Settings Price Car Repair Routes
  {
    path: '/organization/pricing/general',
    name: 'SettingPriceGeneralList',
    component: SettingPriceGeneralPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/organization/settings' },
        { title: 'Prices', href: '/organization/pricing' },
        { title: 'General Price', href: '/organization/pricing/general' }
      ]
    }
  },
  {
    path: '/organization/pricing/impact-unit-time',
    name: 'SettingPriceImpactUnitTimeList',
    component: SettingPriceImpactCountToUtPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/organization/settings' },
        { title: 'Prices', href: '/organization/pricing' },
        { title: 'Impact Unit Time', href: '/organization/pricing/impact-unit-time' }
      ]
    }
  },
  {
    path: '/organization/pricing/variation-coefficients',
    name: 'SettingPriceVariationCoefficientList',
    component: SettingPriceBodyPartCoefficientPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/organization/settings' },
        { title: 'Prices', href: '/organization/pricing' },
        { title: 'Coefficient', href: '/organization/pricing/coefficient' },
        { title: 'Variation', href: '/organization/pricing/variation-coefficients' }
      ]
    }
  },
  {
    path: '/organization/pricing/technicity-coefficients',
    name: 'SettingPriceTechnicityCoefficientList',
    component: SettingPriceTechnicityCoefficientPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/organization/settings' },
        { title: 'Prices', href: '/organization/pricing' },
        { title: 'Coefficient', href: '/organization/pricing/coefficient' },
        { title: 'Technicity', href: '/organization/pricing/technicity-coefficients' }
      ]
    }
  },
];