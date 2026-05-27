// src/router/modules/carSettings/carSettingsRoutes.ts
import SettingPriceBodyPartCoefficientPage from '@/@presentation/@modules/settings/price/pages/SettingPriceBodyPartCoefficientPage.vue';
import SettingPriceGeneralPage from '@/@presentation/@modules/settings/price/pages/SettingPriceGeneralPage.vue';
import SettingPriceImpactCountToUtPage from '@/@presentation/@modules/settings/price/pages/SettingPriceImpactCountToUtPage.vue';
import SettingPriceTechnicityCoefficientPage from '@/@presentation/@modules/settings/price/pages/SettingPriceTechnicityCoefficientPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const settingPriceRoutes: RouteRecordRaw[] = [
  // Settings Price Car Repair Routes
  {
    path: '/organization/pricing/general',
    name: 'SettingPriceGeneralList',
    component: SettingPriceGeneralPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
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
        { title: 'Variation coefficients', href: '/organization/pricing/variation-coefficients' }
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
        { title: 'Technicity coefficients', href: '/organization/pricing/technicity-coefficients' }
      ]
    }
  },
];