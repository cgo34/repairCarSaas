// src/router/modules/dashboard/dashboardRoutes.ts
import DashboardPage from '@/features/dashboard/presentation/views/DashboardPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { 
      requiresAuth: true,
      breadcrumb: [
        { title: 'dashboard.breadcrumb.home', href: '/dashboard' },
      ]
    },
  },
];