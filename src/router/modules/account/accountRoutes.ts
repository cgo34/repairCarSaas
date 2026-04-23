import { RouteRecordRaw } from 'vue-router';

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/account-settings',
    redirect: '/company-settings',
  },
  {
    path: '/company-settings',
    component: () => import('@/@presentation/@modules/account/pages/CompanySettingsPage.vue'),
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Paramètres entreprise', href: '/company-settings' },
      ],
    },
  },
];
