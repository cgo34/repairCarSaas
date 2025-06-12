import CreateQuotePage from '@/@presentation/@modules/quotes/pages/CreateQuotePage.vue';
import EditQuotePage from '@/@presentation/@modules/quotes/pages/EditQuotePage.vue';
import QuotesPage from '@/@presentation/@modules/quotes/pages/QuotesPage.vue';
import ViewQuotePage from '@/@presentation/@modules/quotes/pages/ViewQuotePage.vue';
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
    path: '/quotes/add',
    name: 'New Quote',
    component: CreateQuotePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
        { title: 'New Quote', href: '/quotes/add' },
      ]
    },
  },
  {
    path: '/quotes/:id/view',
    name: 'View Quote',
    component: ViewQuotePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
        { title: 'View Quote', href: '/quotes/:id/view' },
      ]
    },
  },
  {
    path: '/quotes/:id/edit',
    name: 'Edit Quote',
    component: EditQuotePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
        { title: 'Edit Quote', href: '/quotes/:id/edit' },
      ]
    },
  },
];
