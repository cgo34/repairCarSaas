// src/router/modules/carSettings/carSettingsRoutes.ts
import DashboardPage from '@/@presentation/@modules/dashboard/pages/DashboardPageExemple.vue';
import CarBodyMaterialPage from '@/@presentation/@modules/settings/carRepair/pages/CarBodyMaterialPage.vue';
import CarBodyPartPage from '@/@presentation/@modules/settings/carRepair/pages/CarBodyPartPage.vue';
import DentRepairTypePage from '@/@presentation/@modules/settings/carRepair/pages/DentRepairTypePage.vue';
import SettingPriceBodyMaterialCoefficientPage from '@/@presentation/@modules/settings/price/pages/SettingPriceBodyMaterialCoefficientPage.vue';
import SettingPriceBodyPartCoefficientPage from '@/@presentation/@modules/settings/price/pages/SettingPriceBodyPartCoefficientPage.vue';
import SettingPriceDiameterCoefficientPage from '@/@presentation/@modules/settings/price/pages/SettingPriceDiameterCoefficientPage.vue';
import SettingPriceGeneralPage from '@/@presentation/@modules/settings/price/pages/SettingPriceGeneralPage.vue';
import SettingPriceImpactCountToUtPage from '@/@presentation/@modules/settings/price/pages/SettingPriceImpactCountToUtPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const carSettingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings/car-body-parts',
    name: 'CarBodyPartsList',
    component: CarBodyPartPage,
    meta: {
      requiresAuth: true,
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
    path: '/settings/car-body-materials',
    name: 'CarBodyMaterialsList',
    component: CarBodyMaterialPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings' },
        { title: 'Car Body Materials', href: '/car-body-materials' }
      ]
    }
  },
  {
    path: '/car-body-materials/:id',
    name: 'CarBodyMaterialDetail',
    component: DashboardPage,
  },
  {
    path: '/settings/dent-repair-types',
    name: 'DentRepairTypesList',
    component: DentRepairTypePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings' },
        { title: 'Dent Repair Types', href: '/dent-repair-types' }
      ]
    }
  },
  {
    path: '/dent-repair-types/:id',
    name: 'DentRepairTypeDetail',
    component: DashboardPage,
  },
  // Settings Price Car Repair Routes
  {
    path: '/settings/price/general',
    name: 'SettingPriceGeneralList',
    component: SettingPriceGeneralPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings' },
        { title: 'Prices', href: '/price' },
        { title: 'General Price', href: '/general' }
      ]
    }
  },
  {
    path: '/settings/price/impact-unit-time',
    name: 'SettingPriceImpactUnitTimeList',
    component: SettingPriceImpactCountToUtPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings' },
        { title: 'Prices', href: '/price' },
        { title: 'Impact Unit Time', href: '/impact-unit-time' }
      ]
    }
  },
  {
    path: '/settings/price/coefficient/technicity',
    name: 'SettingPriceTechnicityCoefficientList',
    component: SettingPriceBodyMaterialCoefficientPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings' },
        { title: 'Prices', href: '/price' },
        { title: 'Coefficient', href: '/coefficent' },
        { title: 'Technicity', href: '/technicity' }
      ]
    }
  },
  {
    path: '/settings/price/coefficient/variation',
    name: 'SettingPriceVariationCoefficientList',
    component: SettingPriceBodyPartCoefficientPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings' },
        { title: 'Prices', href: '/price' },
        { title: 'Coefficient', href: '/coefficent' },
        { title: 'Variation', href: '/variation' }
      ]
    }
  },
  {
    path: '/settings/price/coefficient/diameter',
    name: 'SettingPriceDiameterCoefficientList',
    component: SettingPriceDiameterCoefficientPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings' },
        { title: 'Prices', href: '/price' },
        { title: 'Coefficient', href: '/coefficent' },
        { title: 'Diameter', href: '/diameter' }
      ]
    }
  },
];