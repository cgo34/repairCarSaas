// src/router/modules/auth/navigationGuards.ts
import { IAuthState } from '@domain/states/IAuthState';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { initAuth } from '@plugins/auth';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const authGuard = async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  
  if (!authState.isAuthReady) {
    await initAuth();
    authState.setAuthReady(true);
  }

  const isAuthenticated = authState.isAuthenticated.value;
  console.log('Navigation guard:', { to: to.path, isAuthenticated });

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  next();
};