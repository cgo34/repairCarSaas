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
        to: '/car-body-materials'
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
        to: '/admin/settings'
      },
      {
        title: 'Dent Removal Pricing',
        icon: CircleIcon,
        to: '/admin/settings'
      }
    ]
  },
  {
    title: 'Logout',
    icon: LogoutIcon,
    to: '/logout',
  },
];