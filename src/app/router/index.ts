// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { accountRoutes } from '@/features/account/presentation/routes/accountRoutes';
import { authRoutes } from '@/features/auth/presentation/routes/authRoutes';
// import { logoutRoute } from './modules/auth/logoutRoute';
import { authGuard } from '@/features/auth/presentation/routes/navigationGuards';
import { carSettingsRoutes } from '@/features/carRepairSettings/presentation/routes/carSettingsRoutes';
import { settingPriceRoutes } from '@/features/priceSettings/presentation/routes/settingPriceRoutes';
import { dashboardRoutes } from '@/features/dashboard/presentation/routes/dashboardRoutes';
import { garageRoutes } from '@/features/garages/presentation/routes/garageRoutes';
import { invoiceRoutes } from '@/features/invoices/presentation/routes/invoiceRoutes';
import { quoteRoutes } from '@/features/quotes/presentation/routes/quoteRoutes';
import { usersRoutes } from '@/features/users/presentation/routes/userRoutes';
import { organizationRoutes } from '@/features/organizations/presentation/routes/organizationRoutes';
import { subscriptionRoutes } from '@/features/subscription/presentation/routes/subscription';
import { weatherRoutes } from '@/features/weather/presentation/routes/weatherRoutes';

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