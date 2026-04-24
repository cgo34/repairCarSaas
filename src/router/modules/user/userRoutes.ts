import OrganizationMembersPage from '@/@presentation/@modules/organizationMembers/pages/OrganizationMemberPage.vue';
import OrganizationProfilePage from '@/@presentation/@modules/organizations/pages/OrganizationProfilePage.vue';
import { RouteRecordRaw } from 'vue-router';

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/technicians',
    name: 'Technicians',
    component: OrganizationMembersPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Utilisateurs', href: '/organization/technicians' },
      ]
    },
  },
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
  },
  {
    path: '/technicians',
    name: 'Technicians',
    component: () => import('@/@presentation/@modules/technicians/pages/TechniciansPage.vue'),
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Techniciens', href: '/technicians' },
      ]
    },
  },
  {
    path: '/technicians/:id',
    name: 'TechnicianDetail',
    component: () => import('@/@presentation/@modules/technicians/pages/TechnicianDetailPage.vue'),
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Techniciens', href: '/technicians' },
        { title: 'Détail', href: '' },
      ]
    },
  },
];
