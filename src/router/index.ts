// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { authRoutes } from './modules/auth/authRoutes';
// import { logoutRoute } from './modules/auth/logoutRoute';
import { authGuard } from './modules/auth/navigationGuards';
import { carSettingsRoutes } from './modules/carSettings/carSettingsRoutes';
import { dashboardRoutes } from './modules/dashboard/dashboardRoutes';

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...carSettingsRoutes,
  // logoutRoute,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;