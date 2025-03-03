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
];
