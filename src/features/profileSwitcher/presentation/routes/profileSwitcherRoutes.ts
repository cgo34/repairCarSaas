import type { RouteRecordRaw } from 'vue-router';

export const profileSwitcherRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/profiles',
    name: 'admin-profiles',
    component: () => import('@/features/profileSwitcher/presentation/views/ProfileSwitcherPage.vue'),
    meta: {
      requiresAuth: true,
      platformAdmin: true,
      breadcrumb: [
        { title: 'profileSwitcher.breadcrumb', disabled: true, href: '#' },
      ],
    },
  },
];
