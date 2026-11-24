import { invoiceItemsGuard } from '@/app/router/guards/invoices/invoiceGuards';
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
        { title: 'Invoices', href: '/invoices' },
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
        { title: 'Invoices', href: '/invoices' },
        { title: 'New Invoice', href: '/invoices/new' },
      ]
    },
  },
  {
    path: '/invoices/view/:id',
    name: 'View Invoice',
    component: ViewInvoicePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Invoices', href: '/invoices' },
        { title: 'View Invoice', href: '/invoices/view/:id' },
      ]
    },
  },
  {
    path: '/invoices/items/:id',
    name: 'Invoice Items',
    component: InvoiceItemsPage,
    beforeEnter: invoiceItemsGuard,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Invoices', href: '/invoices' },
        { title: 'Invoice Items', href: '/invoices/items/:id' },
      ]
    },
  },
  {
    path: '/invoices/edit/:id',
    name: 'Edit Invoice',
    component: EditInvoicePage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { title: 'Invoices', href: '/invoices' },
        { title: 'Edit Invoice', href: '/invoices/edit/:id' },
      ]
    },
  },
];
