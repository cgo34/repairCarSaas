import { RouteRecordRaw } from 'vue-router';

export const subscriptionRoutes: RouteRecordRaw[] = [
  {
    path: '/subscription',
    component: () => import('@/@presentation/layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: '/subscription/overview',
      },

      // =========================
      // MON ABONNEMENT
      // =========================
      {
        path: 'overview',
        name: 'subscription-overview',
        component: () => import('@/pages/subscription/SubscriptionOverviewPage.vue'),
        meta: {
          title: 'Mon abonnement',
          breadcrumb: [
            {
              title: 'Abonnement',
              disabled: true,
              href: '#',
            },
            {
              title: 'Mon abonnement',
              disabled: false,
              href: '/subscription/overview',
            },
          ],
        },
      },

      // =========================
      // UTILISATION
      // =========================
      {
        path: 'usage',
        name: 'subscription-usage',
        component: () => import('@/pages/subscription/SubscriptionUsagePage.vue'),
        meta: {
          title: 'Utilisation',
          breadcrumb: [
            {
              title: 'Abonnement',
              disabled: true,
              href: '#',
            },
            {
              title: 'Utilisation',
              disabled: false,
              href: '/subscription/usage',
            },
          ],
        },
      },

      // =========================
      // FACTURES ABONNEMENT
      // =========================
      {
        path: 'invoices',
        name: 'subscription-invoices',
        component: () => import('@/pages/subscription/SubscriptionInvoicesPage.vue'),
        meta: {
          title: 'Factures abonnement',
          breadcrumb: [
            {
              title: 'Abonnement',
              disabled: true,
              href: '#',
            },
            {
              title: 'Factures',
              disabled: false,
              href: '/subscription/invoices',
            },
          ],
        },
      },
    ],
  },
];