import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import {
  BuildingCommunityIcon,
  // BuildingWarehouseIcon,
  SettingsDollarIcon,
  CircleIcon,
  DashboardIcon,
  FileInvoiceIcon,
  FileEuroIcon,
  ListIcon,
  ToolIcon,
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  // ClockDollarIcon,
} from 'vue-tabler-icons';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

const { subscription } = authState;

const isFreePlan = subscription.value?.subscriptionPlan.name === 'free';

export const adminMenu = [
  // ─────────────────────────────────────────────────────────
  // Dashboard
  // ─────────────────────────────────────────────────────────
  {
    title: 'Tableau de bord',
    icon: DashboardIcon,
    to: '/dashboard',
  },

  {
    divider: true,
  },

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
    children: [
      {
        title: 'Nouveau devis',
        icon: FileInvoiceIcon,
        to: '/quotes/add',
      },
      {
        title: 'Tous les devis',
        icon: ListIcon,
        to: '/quotes',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // Factures
  // ─────────────────────────────────────────────────────────
  {
    title: 'Factures',
    icon: FileEuroIcon,
    children: [
      {
        title: 'Nouvelle facture',
        icon: FileInvoiceIcon,
        to: '/invoices/new',
      },
      {
        title: 'Toutes les factures',
        icon: ListIcon,
        to: '/invoices',
      },
    ],
  },

  {
    divider: true,
  },

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

  {
    divider: true,
  },

  // ─────────────────────────────────────────────────────────
  // Paramètres
  // ─────────────────────────────────────────────────────────
  {
    header: 'Paramètres',
    roles: ['admin'],
  },

  {
    title: 'Entreprise',
    icon: SettingsIcon,
    to: '/organization/settings',
    roles: ['admin'],
  },

  {
    title: 'Tarification',
    icon: SettingsDollarIcon,
    roles: ['admin'],
    children: [
      {
        title: 'Pièces carrosserie',
        icon: CircleIcon,
        to: '/organization/pricing/body-parts',
        roles: ['superadmin'],
      },

      {
        title: 'Matériaux carrosserie',
        icon: CircleIcon,
        to: '/organization/pricing/body-materials',
        roles: ['superadmin'],
      },

      {
        title: 'Types de réparation',
        icon: ToolIcon,
        to: '/organization/pricing/repair-types',
        roles: ['superadmin'],
      },

      {
        title: 'Général',
        icon: CircleIcon,
        to: '/organization/pricing/general',
      },

      {
        title: 'Impact',
        icon: CircleIcon,
        to: '/organization/pricing/impact-unit-time',
      },

      {
        title: 'Technicité',
        icon: CircleIcon,
        to: '/organization/pricing/technicity-coefficients',
      },

      {
        title: 'Variations',
        icon: CircleIcon,
        to: '/organization/pricing/variation-coefficients',
      },
    ],
  },

  {
    divider: true,
    roles: ['admin'],
  },

  // ─────────────────────────────────────────────────────────
  // Abonnement
  // ─────────────────────────────────────────────────────────
  {
    header: 'Abonnement',
    roles: ['admin'],
  },

  {
    title: 'Abonnement',
    icon: CreditCardIcon,
    roles: ['admin'],
    children: [
      {
        title: 'Mon abonnement',
        icon: CircleIcon,
        to: '/subscription/overview',
      },

      {
        title: 'Utilisation',
        icon: CircleIcon,
        to: '/subscription/usage',
      },

      {
        title: 'Factures abonnement',
        icon: CircleIcon,
        to: '/subscription/invoices',
      },
    ],
  },
];

export const menu = adminMenu;