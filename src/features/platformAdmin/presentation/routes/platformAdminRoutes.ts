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
  {
    path: '/platform/organizations',
    name: 'platform-organizations',
    component: () => import('@/features/platformAdmin/presentation/views/PlatformOrganizationsPage.vue'),
    meta: {
      requiresAuth: true,
      platformAdmin: true,
      breadcrumb: [{ title: 'platformAdmin.nav.organizations', disabled: true, href: '#' }],
    },
  },
  {
    path: '/platform/users',
    name: 'platform-users',
    component: () => import('@/features/platformAdmin/presentation/views/PlatformUsersPage.vue'),
    meta: {
      requiresAuth: true,
      platformAdmin: true,
      breadcrumb: [{ title: 'platformAdmin.nav.users', disabled: true, href: '#' }],
    },
  },
  {
    path: '/platform/subscriptions',
    name: 'platform-subscriptions',
    component: () => import('@/features/platformAdmin/presentation/views/PlatformPlansPage.vue'),
    meta: {
      requiresAuth: true,
      platformAdmin: true,
      breadcrumb: [{ title: 'platformAdmin.nav.subscriptions', disabled: true, href: '#' }],
    },
  },
];
