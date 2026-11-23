import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { MenuItem } from '@/app/layouts/menu/filterMenuByRole';

import {
  BuildingCommunityIcon,
  // BuildingWarehouseIcon,
  SettingsDollarIcon,
  CircleIcon,
  DashboardIcon,
  FileInvoiceIcon,
  FileEuroIcon,
  ToolIcon,
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
    title: 'Tableau de bord',
    icon: DashboardIcon,
    to: '/dashboard',
  },

  // ─────────────────────────────────────────────────────────
  // Surveillance grêle
  // ─────────────────────────────────────────────────────────
  {
    title: 'Météo grêle',
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
    header: 'Activité',
    roles: ['admin'],
  },

  // ─────────────────────────────────────────────────────────
  // Devis
  // ─────────────────────────────────────────────────────────
  {
    title: 'Devis',
    icon: FileInvoiceIcon,
    to: '/quotes',
  },

  // ─────────────────────────────────────────────────────────
  // Factures
  // ─────────────────────────────────────────────────────────
  {
    title: 'Factures',
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
    header: 'Organisation',
    roles: ['admin'],
  },

  {
    title: 'Garages',
    icon: BuildingCommunityIcon,
    to: '/organization/garages',
    chip: isFreePlan ? 'Premium' : '',
  },

  {
    title: 'Utilisateurs',
    icon: UserIcon,
    to: '/organization/members',
    chip: isFreePlan ? 'Premium' : '',
    roles: ['admin'],
  },

  // {
  //   divider: true,
  // },

  // ─────────────────────────────────────────────────────────
  // Paramètres
  // ─────────────────────────────────────────────────────────
  {
    header: 'Paramètres',
    roles: ['admin'],
  },

  {
    title: 'Organisation',
    icon: SettingsIcon,
    to: '/organization/settings',
    roles: ['admin'],
  },

  {
    title: 'Tarification',
    icon: SettingsDollarIcon,
    to: '/organization/pricing/general',
    roles: ['admin'],
  },

  {
    title: 'Référentiels',
    icon: SettingsDollarIcon,
    roles: ['superadmin'],
    children: [
      {
        title: 'Pièces carrosserie',
        icon: CircleIcon,
        to: '/organization/pricing/body-parts',
      },

      {
        title: 'Matériaux carrosserie',
        icon: CircleIcon,
        to: '/organization/pricing/body-materials',
      },

      {
        title: 'Types de réparation',
        icon: ToolIcon,
        to: '/organization/pricing/repair-types',
      },
    ],
  },
  {
    title: 'Abonnement',
    icon: CreditCardIcon,
    to: '/subscription/overview',
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
  //     { title: 'Mon abonnement', icon: CircleIcon, to: '/subscription/overview' },
  //     { title: 'Utilisation',    icon: CircleIcon, to: '/subscription/usage'    },
  //     { title: 'Factures abonnement', icon: CircleIcon, to: '/subscription/invoices' },
  //   ],
  // },
];

export const menu = adminMenu;