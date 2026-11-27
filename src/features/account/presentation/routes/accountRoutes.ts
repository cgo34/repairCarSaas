import { RouteRecordRaw } from 'vue-router';

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    component: () => import('@/features/account/presentation/views/UserSettingsPage.vue'),
    meta: {
      requiresAuth: true,
      allowInGlobalContext: true,
      breadcrumb: [
        { title: 'account.breadcrumb.profile', href: '/profile' },
      ],
    },
  },
];
