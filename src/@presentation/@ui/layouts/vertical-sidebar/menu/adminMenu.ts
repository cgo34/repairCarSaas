// src/@presentation/@ui/layouts/vertical-sidebar/menus/adminMenu.ts
import {
  BuildingWarehouseIcon,
  CarIcon,
  CircleIcon,
  DashboardIcon,
  FileEuroIcon,
  FileInvoiceIcon,
  ListIcon,
  LogoutIcon,
  ToolIcon,
  UserIcon
} from 'vue-tabler-icons';

export const adminMenu = [
  { header: 'Dashboard' },
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    to: '/dashboard',
  },
  { divider: true },
  { header: 'Settings' },
  {
    title: 'Car',
    icon: CarIcon,
    to: '/auth',
    children: [
      {
        title: 'Car Body Parts',
        icon: CircleIcon,
        to: '/settings/car-body-parts'
      },
      {
        title: 'Car Body Materials',
        icon: CircleIcon,
        to: '/settings/car-body-materials'
      },
    ]
  },
  {
    title: 'Dent',
    icon: ToolIcon,
    to: '/auth',
    children: [
      {
        title: 'Dent Repair Types',
        icon: ToolIcon,
        to: '/settings/dent-repair-types'
      },
    ]
  },
  {
    title: 'Price',
    icon: FileEuroIcon,
    to: '/auth',
    children: [
      {
        title: 'General Price Parameter',
        icon: CircleIcon,
        to: '/settings/price/general'
      },
      {
        title: 'Impact Unit Time Price Parameter',
        icon: CircleIcon,
        to: '/settings/price/impact-unit-time'
      },
      {
        title: 'Technicity Coefficient Price Parameter',
        icon: CircleIcon,
        to: '/settings/price/coefficient/technicity'
      },
      {
        title: 'Variation Coefficient Price Parameter',
        icon: CircleIcon,
        to: '/settings/price/coefficient/variation'
      },
      {
        title: 'Diameter Coefficient Price Parameter',
        icon: CircleIcon,
        to: '/settings/price/coefficient/diameter'
      },
      {
        title: 'Repair Type Coefficient Price Parameter',
        icon: CircleIcon,
        to: '/settings/price/coefficient/repair-type'
      }
    ]
  },
  { divider: true },
  { header: 'User' },
  {
    title: 'Users',
    icon: UserIcon,
    to: '/Users',
  },
  { divider: true },
  { header: 'Garage' },
  {
    title: 'Garages',
    icon: BuildingWarehouseIcon,
    to: '/garages',
  },
  { divider: true },
  { header: 'Billing' },
  {
    title: 'Quotes',
    to: '/quotes',
    icon: FileInvoiceIcon,
    children: [
      {
        title: 'New',
        icon: FileInvoiceIcon,
        to: '/quotes/new'
      },
      {
        title: 'List',
        icon: ListIcon,
        to: '/quotes'
      },
    ]
  },
  {
    title: 'Invoices',
    to: '/invoices',
    icon: FileInvoiceIcon,
    children: [
      {
        title: 'New',
        icon: FileInvoiceIcon,
        to: '/invoices/new'
      },
      {
        title: 'List',
        icon: ListIcon,
        to: '/invoices'
      },
    ]
  },
  { divider: true },
  { header: 'Account' },
  {
    title: 'Logout',
    icon: LogoutIcon,
    to: '/logout',
  },
];