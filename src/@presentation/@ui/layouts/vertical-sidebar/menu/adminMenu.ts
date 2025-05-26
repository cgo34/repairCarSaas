// src/@presentation/@ui/layouts/vertical-sidebar/menus/adminMenu.ts
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
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


const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

const { user, subscription } = authState

console.log(user.value, subscription.value);


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
    ]
  },
  { divider: true },
  { header: 'User' },
  {
    title: 'Users',
    icon: UserIcon,
    to: '/Users',
    // chip: subscription.value.subscriptionPlan.name === 'free' ? 'PRO' : '',
    // disabled: subscription.value.subscriptionPlan.name === 'free' 
  },
  { divider: true },
  { header: 'Garage' },
  {
    title: 'Garages',
    icon: BuildingWarehouseIcon,
    to: '/garages',
    // chip: subscription.value.subscriptionPlan.name === 'free' ? 'PRO' : '',
    // disabled: subscription.value.subscriptionPlan.name === 'free' 
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