import type { MenuItem } from '@/app/layouts/menu/filterMenuByRole';
import { DashboardIcon } from 'vue-tabler-icons';

export const superAdminMenu: MenuItem[] = [
  {
    title: 'platformAdmin.nav.dashboard',
    icon: DashboardIcon,
    to: '/platform/dashboard',
  },
];
