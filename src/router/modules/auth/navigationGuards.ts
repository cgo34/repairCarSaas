// src/router/modules/auth/navigationGuards.ts

import { IAuthState } from '@domain/states/IAuthState';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';

import {
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router';

export const authGuard = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authState =
    container.get<IAuthState>(SYMBOLS.States.AuthState);

  // ─────────────────────────────────────
  // Refresh authenticated context
  // ─────────────────────────────────────
  if (authState.isAuthenticated.value) {
    await authState.refreshAuthenticatedUser();
  }

  // ─────────────────────────────────────
  // Check authentication
  // ─────────────────────────────────────
  if (
    to.meta.requiresAuth &&
    !authState.isAuthenticated.value
  ) {
    return next('/login');
  }

  // ─────────────────────────────────────
  // Check roles
  // ─────────────────────────────────────
  const authorizedRoles =
    to.meta.roles as string[] | undefined;

  if (authorizedRoles?.length) {
    const currentUserRole =
      authState.userContext.value?.membership.role;

    const hasAccess =
      authorizedRoles.includes(currentUserRole ?? '');

    if (!hasAccess) {
      return next('/403');
    }
  }

  next();
};