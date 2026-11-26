import type { MenuItem } from '@/app/layouts/menu/filterMenuByRole';
import { DashboardIcon, BuildingCommunityIcon, UsersIcon, CrownIcon } from 'vue-tabler-icons';

export const superAdminMenu: MenuItem[] = [
  {
    title: 'platformAdmin.nav.dashboard',
    icon: DashboardIcon,
    to: '/platform/dashboard',
  },
  {
    title: 'platformAdmin.nav.organizations',
    icon: BuildingCommunityIcon,
    to: '/platform/organizations',
  },
  {
    title: 'platformAdmin.nav.users',
    icon: UsersIcon,
    to: '/platform/users',
  },
  {
    title: 'platformAdmin.nav.subscriptions',
    icon: CrownIcon,
    to: '/platform/subscriptions',
  },
];
