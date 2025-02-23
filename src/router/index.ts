// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { authRoutes } from './modules/auth/authRoutes';
// import { logoutRoute } from './modules/auth/logoutRoute';
import { authGuard } from './modules/auth/navigationGuards';
import { carSettingsRoutes } from './modules/carSettings/carSettingsRoutes';
import { dashboardRoutes } from './modules/dashboard/dashboardRoutes';
import { garageRoutes } from './modules/garage/garageRoutes';

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...carSettingsRoutes,
  ...garageRoutes,
  // logoutRoute,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;