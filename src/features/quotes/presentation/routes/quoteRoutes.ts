import { quoteEditGuard, quoteItemsGuard, quotePreviewGuard, quoteViewGuard } from '@/app/router/guards/quotes/quoteGuards';
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
        { title: 'quotes.breadcrumb.list', href: '/quotes' },
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
        { title: 'quotes.breadcrumb.list', href: '/quotes' },
        { title: 'quotes.breadcrumb.new', href: '/quotes/new' },
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
        { title: 'quotes.breadcrumb.list', href: '/quotes' },
        { title: 'quotes.breadcrumb.edit', href: '/quotes/edit' },
      ]
    },
  },
  {
    path: '/quotes/edit/items',
    name: 'Quote Items',
    component: QuoteItemsPage,
    beforeEnter: quoteItemsGuard,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'quotes.breadcrumb.list', href: '/quotes' },
        { title: 'quotes.breadcrumb.edit', href: '/quotes/edit' },
        { title: 'quotes.breadcrumb.items', href: '/quotes/edit/items' },
      ]
    },
  },
  {
    // Same component as /quotes/edit: it renders read-only once the quote is locked.
    path: '/quotes/view',
    name: 'View Quote',
    component: EditQuotePage,
    beforeEnter: quoteViewGuard,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'quotes.breadcrumb.list', href: '/quotes' },
        { title: 'quotes.breadcrumb.view', href: '/quotes/view' },
      ]
    },
  },
  {
    path: '/quotes/preview',
    name: 'Preview Quote',
    component: ViewQuotePage,
    beforeEnter: quotePreviewGuard,
    meta: {
      requiresAuth: true,
      // Default value: the guard replaces the parent crumb depending on the quote state.
      breadcrumb: [
        { title: 'quotes.breadcrumb.list', href: '/quotes' },
        { title: 'quotes.breadcrumb.preview', href: '/quotes/preview' },
      ]
    },
  },
];
