import OrganizationMembersPage from '@/features/organizations/presentation/views/OrganizationMemberPage.vue';
import OrganizationMembersDetailPage from '@/features/technicians/presentation/views/TechnicianDetailPage.vue';
import OrganizationProfilePage from '@/features/organizations/presentation/views/OrganizationProfilePage.vue';
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
  //   component: () => import('@/features/technicians/presentation/views/TechniciansPage.vue'),
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
  //   component: () => import('@/features/technicians/presentation/views/TechniciansPage.vue'),
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
