import LoginPage from '@/@presentation/@modules/auth/pages/LoginPage.vue';
import RegisterPage from '@/@presentation/@modules/auth/pages/RegisterPage.vue';
import DashboardPage from '@/@presentation/@modules/dashboard/pages/DashboardPage.vue';
import { IAuthProvider } from '@domain/providers/IAuthProvider';
import { IAuthState } from '@domain/states/IAuthState';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { initAuth } from '@plugins/auth';
import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router';

const routes = [
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/login', 
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  { 
    path: '/register', 
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
  { 
    path: '/dashboard', 
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/logout',
    component: {},
    beforeEnter: async (_to, _from, next) => {
      try {
        const authProvider = container.get<IAuthProvider>(SYMBOLS.Providers.AuthProvider);
        const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
        
        // Déconnexion de Supabase
        await authProvider.signOut();
        
        // Nettoyage de l'état
        authState.user.value = null;
        authState.isAuthenticated.value = false;
        
        // Nettoyage du stockage local
        localStorage.clear();
        
        // Réinitialiser le flag d'auth
        isAuthReady = false;
        
        // Attendre un peu pour s'assurer que tout est nettoyé
        await new Promise(resolve => setTimeout(resolve, 100));
        
        next('/login');
      } catch (error) {
        console.error('Logout error:', error);
        next('/login');
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

let isAuthReady = false;

router.beforeEach(async (to: RouteLocationNormalized, _from, next) => {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  
  if (!isAuthReady) {
    await initAuth();
    isAuthReady = true;
  }

  const isAuthenticated = authState.isAuthenticated.value;
  console.log('Navigation guard:', { to: to.path, isAuthenticated });

  // if (to.meta.requiresGuest && isAuthenticated) {
  //   return next('/dashboard');
  // }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  next();
});

export default router;