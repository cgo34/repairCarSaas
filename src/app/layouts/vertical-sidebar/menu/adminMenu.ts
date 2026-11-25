import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { MenuItem } from '@/app/layouts/menu/filterMenuByRole';

import {
  BuildingCommunityIcon,
  // BuildingWarehouseIcon,
  SettingsDollarIcon,
  DashboardIcon,
  FileInvoiceIcon,
  FileEuroIcon,
  UserIcon,
  SettingsIcon,
  CloudStormIcon,
  CreditCardIcon,
  // ClockDollarIcon,
} from 'vue-tabler-icons';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

const { subscription } = authState;

const isFreePlan = subscription.value?.subscriptionPlan.name === 'free';

export const adminMenu: MenuItem[] = [
  // ─────────────────────────────────────────────────────────
  // Dashboard
  // ─────────────────────────────────────────────────────────
  {
    title: 'common.nav.dashboard',
    icon: DashboardIcon,
    to: '/dashboard',
  },

  // ─────────────────────────────────────────────────────────
  // Surveillance grêle
  // ─────────────────────────────────────────────────────────
  {
    title: 'common.nav.hail',
    icon: CloudStormIcon,
    to: '/weather',
  },

  // {
  //   divider: true,
  // },

  // ─────────────────────────────────────────────────────────
  // Activité
  // ─────────────────────────────────────────────────────────
  {
    header: 'common.nav.activity',
    roles: ['admin'],
  },

  // ─────────────────────────────────────────────────────────
  // Devis
  // ─────────────────────────────────────────────────────────
  {
    title: 'common.nav.quotes',
    icon: FileInvoiceIcon,
    to: '/quotes',
  },

  // ─────────────────────────────────────────────────────────
  // Factures
  // ─────────────────────────────────────────────────────────
  {
    title: 'common.nav.invoices',
    icon: FileEuroIcon,
    to: '/invoices',
  },

  // {
  //   divider: true,
  // },

  // ─────────────────────────────────────────────────────────
  // Organisation
  // ─────────────────────────────────────────────────────────
  {
    header: 'common.nav.organization',
    roles: ['admin'],
  },

  {
    title: 'common.nav.members',
    icon: UserIcon,
    to: '/organization/members',
    chip: isFreePlan ? 'common.nav.premium' : '',
    roles: ['admin'],
  },

  {
    title: 'common.nav.garages',
    icon: BuildingCommunityIcon,
    to: '/organization/garages',
    chip: isFreePlan ? 'common.nav.premium' : '',
  },

  // {
  //   divider: true,
  // },

  // ─────────────────────────────────────────────────────────
  // Paramètres
  // ─────────────────────────────────────────────────────────
  {
    header: 'common.nav.settings',
    roles: ['admin'],
  },

  {
    title: 'common.nav.organizationSettings',
    icon: SettingsIcon,
    to: '/organization/profile',
    roles: ['admin'],
  },

  {
    title: 'common.nav.pricing',
    icon: SettingsDollarIcon,
    to: '/organization/pricing',
    roles: ['admin'],
  },

  {
    title: 'common.nav.subscription',
    icon: CreditCardIcon,
    to: '/subscription',
    roles: ['admin'],
  },

  // {
  //   divider: true,
  //   roles: ['admin'],
  // },

  // ─────────────────────────────────────────────────────────
  // Abonnement (masqué — page non finalisée)
  // ─────────────────────────────────────────────────────────
  // {
  //   header: 'Abonnement',
  //   roles: ['admin'],
  // },
  // {
  //   title: 'Abonnement',
  //   icon: CreditCardIcon,
  //   roles: ['admin'],
  //   children: [
  //     { title: 'Mon abonnement', icon: CircleIcon, to: '/subscription' },
  //     { title: 'Utilisation',    icon: CircleIcon, to: '/subscription/usage'    },
  //     { title: 'Factures abonnement', icon: CircleIcon, to: '/subscription/invoices' },
  //   ],
  // },
];

export const menu = adminMenu;