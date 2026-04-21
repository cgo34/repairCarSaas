import { RouteRecordRaw } from 'vue-router';

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/account-settings',
    component: () => import('@/@presentation/@modules/account/pages/AccountSettingsPage.vue'),
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Paramètres entreprise', href: '/account-settings' },
      ],
    },
  },
];
