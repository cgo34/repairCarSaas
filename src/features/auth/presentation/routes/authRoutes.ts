// src/router/modules/auth/authRoutes.ts
import { useLogoutRouteDependencies } from '@/features/auth/composition/useAuthRouteDependencies';
import ForgotPasswordPage from '@/features/auth/presentation/views/ForgotPasswordPage.vue';
import LoginPage from '@/features/auth/presentation/views/LoginPage.vue';
import RegisterPage from '@/features/auth/presentation/views/RegisterPage.vue';
import ResetPasswordPage from '@/features/auth/presentation/views/ResetPasswordPage.vue';
import RedirectHome from '@/features/auth/presentation/views/RedirectHome.vue';
import { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: RedirectHome,
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
        const { clientProvider, authState } = useLogoutRouteDependencies();
        
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