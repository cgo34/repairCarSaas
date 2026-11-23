import PricingSettingsPage from '@/features/priceSettings/presentation/views/PricingSettingsPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const settingPriceRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/pricing',
    redirect: '/organization/pricing/general'
  },
  {
    path: '/organization/pricing/:tab(general|impact-unit-time|technicity-coefficients|variation-coefficients)',
    name: 'PricingSettings',
    component: PricingSettingsPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tarification', href: '/organization/pricing/general' }
      ]
    }
  },
];