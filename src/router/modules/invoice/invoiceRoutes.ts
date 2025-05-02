import CreateInvoicePage from '@/@presentation/@modules/invoices/pages/CreateInvoicePage.vue';
import EditInvoicePage from '@/@presentation/@modules/invoices/pages/EditInvoicePage.vue';
import InvoicesPage from '@/@presentation/@modules/invoices/pages/InvoicesPage.vue';
import ViewInvoicePage from '@/@presentation/@modules/invoices/pages/ViewInvoicePage.vue';
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
