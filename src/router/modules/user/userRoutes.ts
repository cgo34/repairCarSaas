import OrganizationMembersPage from '@/@presentation/@modules/organizationMembers/pages/OrganizationMemberPage.vue';
import OrganizationMembersDetailPage from '@/@presentation/@modules/organizationMembers/pages/TechnicianDetailPage.vue';
import OrganizationProfilePage from '@/@presentation/@modules/organizations/pages/OrganizationProfilePage.vue';
import { RouteRecordRaw } from 'vue-router';

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/members',
    name: 'Members',
    component: OrganizationMembersPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Utilisateurs', href: '/organization/members' },
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
  // {
  //   path: '/technicians',
  //   name: 'Technicians',
  //   component: () => import('@/@presentation/@modules/technicians/pages/TechniciansPage.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     breadcrumb: [
  //       { title: 'Techniciens', href: '/technicians' },
  //     ]
  //   },
  // },
  // {
  //   path: '/technicians/:id',
  //   name: 'TechnicianDetail',
  //   component: () => import('@/@presentation/@modules/technicians/pages/TechnicianDetailPage.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     breadcrumb: [
  //       { title: 'Techniciens', href: '/technicians' },
  //       { title: 'Détail', href: '' },
  //     ]
  //   },
  // },
  // {
  //   path: '/technicians',
  //   name: 'Technicians',
  //   component: () => import('@/@presentation/@modules/technicians/pages/TechniciansPage.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     breadcrumb: [
  //       { title: 'Techniciens', href: '/technicians' },
  //     ]
  //   },
  // },
  // TODO: (GCE) -> move page to organization members module
  {
    path: '/organization/members/:id',
    name: 'TechnicianDetail',
    component: OrganizationMembersDetailPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Membres', href: '/organization/members' },
        { title: 'Détail', href: '' },
      ]
    },
  },
];
