import type { RouteRecordRaw } from 'vue-router';

export const platformAdminRoutes: RouteRecordRaw[] = [
  {
    path: '/platform/dashboard',
    name: 'platform-dashboard',
    component: () => import('@/features/platformAdmin/presentation/views/PlatformDashboardPage.vue'),
    meta: {
      requiresAuth: true,
      platformAdmin: true,
      breadcrumb: [
        { title: 'platformAdmin.dashboard.breadcrumb', disabled: true, href: '#' },
      ],
    },
  },
];
