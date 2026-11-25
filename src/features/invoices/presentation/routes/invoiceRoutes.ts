import { invoiceEditGuard, invoiceItemsGuard, invoicePreviewGuard, invoiceViewGuard } from '@/app/router/guards/invoices/invoiceGuards';
import InvoiceItemsPage from '@/features/invoices/presentation/views/InvoiceItemsPage.vue';
import CreateInvoicePage from '@/features/invoices/presentation/views/CreateInvoicePage.vue';
import EditInvoicePage from '@/features/invoices/presentation/views/EditInvoicePage.vue';
import InvoicesPage from '@/features/invoices/presentation/views/InvoicesPage.vue';
import ViewInvoicePage from '@/features/invoices/presentation/views/ViewInvoicePage.vue';
import { RouteRecordRaw } from 'vue-router';

export const invoiceRoutes: RouteRecordRaw[] = [
  {
    path: '/invoices',
    name: 'Invoices',
    component: InvoicesPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'invoices.breadcrumb.list', href: '/invoices' },
      ]
    },
  },
  {
    path: '/invoices/new',
    name: 'New Invoice',
    component: CreateInvoicePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'invoices.breadcrumb.list', href: '/invoices' },
        { title: 'invoices.breadcrumb.new', href: '/invoices/new' },
      ]
    },
  },
  {
    path: '/invoices/edit',
    name: 'Edit Invoice',
    component: EditInvoicePage,
    beforeEnter: invoiceEditGuard,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'invoices.breadcrumb.list', href: '/invoices' },
        { title: 'invoices.breadcrumb.edit', href: '/invoices/edit' },
      ]
    },
  },
  {
    path: '/invoices/edit/items',
    name: 'Invoice Items',
    component: InvoiceItemsPage,
    beforeEnter: invoiceItemsGuard,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'invoices.breadcrumb.list', href: '/invoices' },
        { title: 'invoices.breadcrumb.edit', href: '/invoices/edit' },
        { title: 'invoices.breadcrumb.items', href: '/invoices/edit/items' },
      ]
    },
  },
  {
    // Same component as /invoices/edit: it renders read-only once the invoice is locked.
    path: '/invoices/view',
    name: 'View Invoice',
    component: EditInvoicePage,
    beforeEnter: invoiceViewGuard,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'invoices.breadcrumb.list', href: '/invoices' },
        { title: 'invoices.breadcrumb.view', href: '/invoices/view' },
      ]
    },
  },
  {
    path: '/invoices/preview',
    name: 'Preview Invoice',
    component: ViewInvoicePage,
    beforeEnter: invoicePreviewGuard,
    meta: {
      requiresAuth: true,
      // Default value: the guard replaces the parent crumb depending on the invoice state.
      breadcrumb: [
        { title: 'invoices.breadcrumb.list', href: '/invoices' },
        { title: 'invoices.breadcrumb.preview', href: '/invoices/preview' },
      ]
    },
  },
];
