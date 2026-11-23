import CreateQuotePage from '@/features/quotes/presentation/views/CreateQuotePage.vue';
import EditQuotePage from '@/features/quotes/presentation/views/EditQuotePage.vue';
import QuotesPage from '@/features/quotes/presentation/views/QuotesPage.vue';
import ViewQuotePage from '@/features/quotes/presentation/views/ViewQuotePage.vue';
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
