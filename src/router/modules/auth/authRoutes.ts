// src/router/modules/auth/authRoutes.ts
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import ForgotPasswordPage from '@/@presentation/@modules/auth/pages/ForgotPasswordPage.vue';
import LoginPage from '@/@presentation/@modules/auth/pages/LoginPage.vue';
import RegisterPage from '@/@presentation/@modules/auth/pages/RegisterPage.vue';
import ResetPasswordPage from '@/@presentation/@modules/auth/pages/ResetPasswordPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresGuest: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordPage
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordPage,
    props: route => ({ token: route.query.token }) // 🔥 Important pour garder le token
  },  
  {
    path: '/logout',
    component: {},
    beforeEnter: async (_to, _from, next) => {
      try {
        //TODO: (GCE) -> TO BE REPLACED WITH USE CASE
        const clientProvider = container.get<IClientProvider>(SYMBOLS.Providers.ClientProvider);
        const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
        
        // Déconnexion de Supabase
        await clientProvider.getClient().auth.signOut();
        
        // Nettoyage de l'état
        authState.user.value = undefined;
        authState.isAuthenticated.value = false;
        
        // Nettoyage du stockage local
        localStorage.clear();
      
        // Réinitialiser le flag d'auth
        authState.setAuthReady(false);
        
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