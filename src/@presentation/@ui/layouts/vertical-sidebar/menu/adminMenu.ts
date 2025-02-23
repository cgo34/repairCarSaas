// src/@presentation/@ui/layouts/vertical-sidebar/menus/adminMenu.ts
import {
  CircleIcon,
  DashboardIcon,
  KeyIcon,
  LogoutIcon
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
    icon: KeyIcon,
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
    icon: KeyIcon,
    to: '/auth',
    children: [
      {
        title: 'Dent Repair Types',
        icon: CircleIcon,
        to: '/settings/dent-repair-types'
      },
    ]
  },
  {
    title: 'Price',
    icon: KeyIcon,
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
      }
    ]
  },
  { divider: true },
  { header: 'Garage' },
  {
    title: 'Garages',
    icon: DashboardIcon,
    to: '/garages',
  },
  { divider: true },
  {
    title: 'Logout',
    icon: LogoutIcon,
    to: '/logout',
  },
];