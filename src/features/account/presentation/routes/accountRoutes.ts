import { RouteRecordRaw } from 'vue-router';

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/account-settings',
    redirect: '/company-settings',
  },
  {
    path: '/company-settings',
    component: () => import('@/features/account/presentation/views/CompanySettingsPage.vue'),
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Paramètres entreprise', href: '/company-settings' },
      ],
    },
  },
  {
    path: '/profile',
    component: () => import('@/features/account/presentation/views/UserSettingsPage.vue'),
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Mon profil', href: '/profile' },
      ],
    },
  },
];
