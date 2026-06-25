// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { accountRoutes } from './modules/account/accountRoutes';
import { authRoutes } from './modules/auth/authRoutes';
// import { logoutRoute } from './modules/auth/logoutRoute';
import { authGuard } from './modules/auth/navigationGuards';
import { carSettingsRoutes } from './modules/carSettings/carSettingsRoutes';
import { settingPriceRoutes } from './modules/settingPrice/settingPriceRoutes';
import { dashboardRoutes } from './modules/dashboard/dashboardRoutes';
import { garageRoutes } from './modules/garage/garageRoutes';
import { invoiceRoutes } from './modules/invoice/invoiceRoutes';
import { quoteRoutes } from './modules/quote/quoteRoutes';
import { usersRoutes } from './modules/user/userRoutes';
import { organizationRoutes } from './modules/organization/organizationRoutes';
import { subscriptionRoutes } from './modules/subscriptionRoutes/subscription';
import { weatherRoutes } from './modules/weather/weatherRoutes';

const routes: RouteRecordRaw[] = [
  ...authRoutes,
  ...carSettingsRoutes,
  ...dashboardRoutes,
  ...quoteRoutes,
  ...invoiceRoutes,
  ...garageRoutes,
  ...usersRoutes,
  ...organizationRoutes,
  ...settingPriceRoutes,
  ...accountRoutes,
  ...subscriptionRoutes,
  ...weatherRoutes
  // logoutRoute,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;