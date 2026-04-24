// src/@presentation/@ui/layouts/vertical-sidebar/menus/adminMenu.ts
import { computed } from 'vue';
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
  UserIcon,
  UserCogIcon
} from 'vue-tabler-icons';


const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

const { user, subscription } = authState

const adminMenu = [
  // ─── Dashboard ───────────────────────────────────────────
  { header: 'Dashboard' },
  {
    title: 'Tableau de bord',
    icon: DashboardIcon,
    to: '/dashboard',
  },
  { divider: true },

  // ─── Facturation ─────────────────────────────────────────
  { header: 'Facturation' },
  {
    title: 'Devis',
    to: '/quotes',
    icon: FileInvoiceIcon,
    children: [
      {
        title: 'Ajouter',
        icon: FileInvoiceIcon,
        to: '/quotes/add'
      },
      {
        title: 'Liste',
        icon: ListIcon,
        to: '/quotes'
      },
    ]
  },
  {
    title: 'Factures',
    to: '/invoices',
    icon: FileInvoiceIcon,
    children: [
      {
        title: 'Nouveau',
        icon: FileInvoiceIcon,
        to: '/invoices/new'
      },
      {
        title: 'Liste',
        icon: ListIcon,
        to: '/invoices'
      },
    ]
  },
  { divider: true },

  // ─── Garages ─────────────────────────────────────────────
  { header: 'Garages' },
  {
    title: 'Garages',
    icon: BuildingWarehouseIcon,
    to: '/garages',
  },
  { divider: true },

  // ─── Utilisateurs ────────────────────────────────────────
  { header: 'Utilisateurs' },
  {
    title: 'Utilisateurs',
    icon: UserIcon,
    to: '/Users',
  },
  {
    title: 'Techniciens',
    icon: UserCogIcon,
    to: '/technicians',
  },
  { divider: true },

  // ─── Paramètres ──────────────────────────────────────────
  { header: 'Paramètres' },
  {
    title: 'Voiture',
    icon: CarIcon,
    to: '/auth',
    children: [
      {
        title: 'Pièces carrosserie',
        icon: CircleIcon,
        to: '/settings/car-body-parts'
      },
      {
        title: 'Matériaux carrosserie',
        icon: CircleIcon,
        to: '/settings/car-body-materials'
      },
    ]
  },
  {
    title: 'Débosselage',
    icon: ToolIcon,
    to: '/auth',
    children: [
      {
        title: 'Types de réparation',
        icon: ToolIcon,
        to: '/settings/dent-repair-types'
      },
    ]
  },
  {
    title: 'Tarifs',
    icon: FileEuroIcon,
    to: '/auth',
    children: [
      {
        title: 'Paramètres généraux',
        icon: CircleIcon,
        to: '/settings/price/general'
      },
      {
        title: 'Prix unitaire impact',
        icon: CircleIcon,
        to: '/settings/price/impact-unit-time'
      },
      {
        title: 'Coeff. technicité',
        icon: CircleIcon,
        to: '/settings/price/coefficient/technicity'
      },
      {
        title: 'Coeff. variation',
        icon: CircleIcon,
        to: '/settings/price/coefficient/variation'
      },
    ]
  },
  { divider: true },

  // ─── Compte ──────────────────────────────────────────────
  { header: 'Compte' },
  {
    title: 'Déconnexion',
    icon: LogoutIcon,
    to: '/logout',
  },
];

const userMenu = [
  // ─── Dashboard ───────────────────────────────────────────
  { header: 'Dashboard' },
  {
    title: 'Tableau de bord',
    icon: DashboardIcon,
    to: '/dashboard',
  },
  { divider: true },

  // ─── Facturation ─────────────────────────────────────────
  { header: 'Facturation' },
  {
    title: 'Devis',
    to: '/quotes',
    icon: FileInvoiceIcon,
    children: [
      {
        title: 'Ajouter',
        icon: FileInvoiceIcon,
        to: '/quotes/add'
      },
      {
        title: 'Liste',
        icon: ListIcon,
        to: '/quotes'
      },
    ]
  },
  {
    title: 'Factures',
    to: '/invoices',
    icon: FileInvoiceIcon,
    children: [
      {
        title: 'Nouveau',
        icon: FileInvoiceIcon,
        to: '/invoices/new'
      },
      {
        title: 'Liste',
        icon: ListIcon,
        to: '/invoices'
      },
    ]
  },
  { divider: true },

  // ─── Garages ─────────────────────────────────────────────
  { header: 'Garages' },
  {
    title: 'Garages',
    icon: BuildingWarehouseIcon,
    to: '/garages',
    chip: subscription.value?.subscriptionPlan.name === 'free' ? 'PRO' : '',
  },
  { divider: true },

  // ─── Utilisateurs ────────────────────────────────────────
  { header: 'Utilisateurs' },
  {
    title: 'Utilisateurs',
    icon: UserIcon,
    to: '/Users',
    chip: subscription.value?.subscriptionPlan.name === 'free' ? 'PRO' : '',
  },
  { divider: true },

  // ─── Paramètres ──────────────────────────────────────────
  { header: 'Paramètres' },
  {
    title: 'Tarifs',
    icon: FileEuroIcon,
    to: '/auth',
    children: [
      {
        title: 'Paramètres généraux',
        icon: CircleIcon,
        to: '/settings/price/general'
      },
      {
        title: 'Prix unitaire impact',
        icon: CircleIcon,
        to: '/settings/price/impact-unit-time'
      },
      {
        title: 'Coeff. technicité',
        icon: CircleIcon,
        to: '/settings/price/coefficient/technicity'
      },
      {
        title: 'Coeff. variation',
        icon: CircleIcon,
        to: '/settings/price/coefficient/variation'
      },
    ]
  },
  { divider: true },

  // ─── Compte ──────────────────────────────────────────────
  { header: 'Compte' },
  {
    title: 'Déconnexion',
    icon: LogoutIcon,
    to: '/logout',
  },
];

export const menu = computed(() => adminMenu)
