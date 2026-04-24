import UsersPage from '@/@presentation/@modules/users/pages/UsersPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'Users',
    component: UsersPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Utilisateurs', href: '/users' },
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
