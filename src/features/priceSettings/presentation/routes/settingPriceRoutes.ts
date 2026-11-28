import PricingSettingsPage from '@/features/priceSettings/presentation/views/PricingSettingsPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const settingPriceRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/pricing/:tab(impact-unit-time|technicity-coefficients|variation-coefficients)?',
    name: 'PricingSettings',
    component: PricingSettingsPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'dashboard.breadcrumb.home', href: '/dashboard' },
        { title: 'priceSettings.breadcrumb.pricing', href: '/organization/pricing' }
      ]
    }
  },
];