import { RouteRecordRaw } from 'vue-router';

export const subscriptionRoutes: RouteRecordRaw[] = [
  {
    path: '/subscription',
    component: () => import('@/features/subscription/presentation/views/SubscriptionPage.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      // =========================
      // MON ABONNEMENT
      // =========================
      {
        path: '',
        name: 'subscription-overview',
        component: () => import('@/features/subscription/presentation/views/SubscriptionPage.vue'),
        meta: {
          breadcrumb: [
            {
              title: 'subscription.breadcrumb.root',
              disabled: true,
              href: '#',
            },
            {
              title: 'subscription.breadcrumb.mine',
              disabled: false,
              href: '/subscription',
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
        component: () => import('@/features/subscription/presentation/views/SubscriptionPage.vue'),
        meta: {
          title: 'subscription.breadcrumb.usage',
          breadcrumb: [
            {
              title: 'subscription.breadcrumb.root',
              disabled: true,
              href: '#',
            },
            {
              title: 'subscription.breadcrumb.usage',
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
        component: () => import('@/features/subscription/presentation/views/SubscriptionPage.vue'),
        meta: {
          title: 'subscription.breadcrumb.invoices',
          breadcrumb: [
            {
              title: 'subscription.breadcrumb.root',
              disabled: true,
              href: '#',
            },
            {
              title: 'subscription.breadcrumb.invoices',
              disabled: false,
              href: '/subscription/invoices',
            },
          ],
        },
      },
    ],
  },
];