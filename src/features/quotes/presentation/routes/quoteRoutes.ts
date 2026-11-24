import { quoteEditGuard, quoteItemsGuard, quoteViewGuard } from '@/app/router/guards/quotes/quoteGuards';
import CreateQuotePage from '@/features/quotes/presentation/views/CreateQuotePage.vue';
import EditQuotePage from '@/features/quotes/presentation/views/EditQuotePage.vue';
import QuoteItemsPage from '@/features/quotes/presentation/views/QuoteItemsPage.vue';
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
    path: '/quotes/view',
    name: 'View Quote',
    component: ViewQuotePage,
    beforeEnter: quoteViewGuard,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
        { title: 'View Quote', href: '/quotes/view' },
      ]
    },
  },
  {
    path: '/quotes/edit',
    name: 'Edit Quote',
    component: EditQuotePage,
    beforeEnter: quoteEditGuard,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
        { title: 'Edit Quote', href: '/quotes/edit' },
      ]
    },
  },
  {
    path: '/quotes/items',
    name: 'Quote Items',
    component: QuoteItemsPage,
    beforeEnter: quoteItemsGuard,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Quotes', href: '/quotes' },
        { title: 'Quote Items', href: '/quotes/items' },
      ]
    },
  },
];