import GaragesPage from '@/features/garages/presentation/views/GaragesPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const garageRoutes: RouteRecordRaw[] = [
  {
    path: '/organization/garages',
    name: 'Garages',
    component: GaragesPage,
    meta: {
      requiresAuth: true,
      roles: ['technician', 'admin'],
      subtitle: 'Manage your garages',
      breadcrumb: [
        { title: 'garages.breadcrumb.list', href: '/organization/garages' },
      ]
    },
  },
];
