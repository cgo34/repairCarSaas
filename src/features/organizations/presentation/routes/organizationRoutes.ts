import OrganizationProfilePage from '@/features/organizations/presentation/views/OrganizationProfilePage.vue';
import { RouteRecordRaw } from 'vue-router';

export const organizationRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/settings',
    name: 'Settings',
    component: OrganizationProfilePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Paramètres', href: '/organization/settings' },
      ]
    },
  }
];
