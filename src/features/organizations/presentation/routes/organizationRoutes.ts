import OrganizationProfilePage from '@/features/organizations/presentation/views/OrganizationProfilePage.vue';
import { RouteRecordRaw } from 'vue-router';

export const organizationRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/profile',
    name: 'Settings',
    component: OrganizationProfilePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'organizations.breadcrumb.profile', href: '/organization/profile' },
      ]
    },
  }
];
