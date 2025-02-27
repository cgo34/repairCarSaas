import CreateQuotePage from '@/@presentation/@modules/quotes/pages/CreateQuotePage.vue';
import QuotesPage from '@/@presentation/@modules/quotes/pages/QuotesPage.vue';
import { RouteRecordRaw } from 'vue-router';

export const quoteRoutes: RouteRecordRaw[] = [
  {
    path: '/quotes',
    name: 'Quotes',
    component: QuotesPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
      ]
    },
  },
  {
    path: '/quotes/new',
    name: 'New Quote',
    component: CreateQuotePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
        { title: 'New Quote', href: '/quotes/new' },
      ]
    },
  }
];
