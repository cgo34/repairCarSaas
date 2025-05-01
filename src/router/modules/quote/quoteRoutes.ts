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
  },
  {
    path: '/quotes/view/:id',
    name: 'View Quote',
    component: ViewQuotePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
        { title: 'View Quote', href: '/quotes/view/:id' },
      ]
    },
  },
  {
    path: '/quotes/edit/:id',
    name: 'Edit Quote',
    component: EditQuotePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
        { title: 'Edit Quote', href: '/quotes/edit/:id' },
      ]
    },
  },
];
