// src/router/modules/auth/navigationGuards.ts

import { useAuthGuardDependencies } from '@/features/auth/composition/useAuthRouteDependencies';

import {
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router';

export const authGuard = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { authState } = useAuthGuardDependencies();

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