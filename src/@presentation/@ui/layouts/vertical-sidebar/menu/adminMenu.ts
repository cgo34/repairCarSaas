import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import {
BuildingWarehouseIcon,
CircleIcon,
DashboardIcon,
FileEuroIcon,
FileInvoiceIcon,
ListIcon,
ToolIcon,
UserIcon,
SettingsIcon,
CreditCardIcon,
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

{ divider: true },

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
icon: FileInvoiceIcon,
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

{ divider: true },

// ─────────────────────────────────────────────────────────
// Organisation
// ─────────────────────────────────────────────────────────
{ header: 'Organisation',
  roles: ['admin']
},

{
title: 'Garages',
icon: BuildingWarehouseIcon,
to: '/organization/garages',
chip: isFreePlan ? 'Premium' : '',
},

{
title: 'Techniciens',
icon: UserIcon,
to: '/organization/technicians',
chip: isFreePlan ? 'Premium' : '',
roles: ['admin'],
},

{
title: 'Paramètres entreprise',
icon: SettingsIcon,
to: '/organization/settings',
roles: ['admin'],
},

{
title: 'Tarification',
icon: FileEuroIcon,
roles: ['admin'],
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
{
title: 'Paramètres généraux',
icon: CircleIcon,
to: '/organization/pricing/general',
},
{
title: 'Prix unitaire impact',
icon: CircleIcon,
to: '/organization/pricing/impact-unit-time',
},
{
title: 'Coeff. technicité',
icon: CircleIcon,
to: '/organization/pricing/technicity-coefficients',
},
{
title: 'Coeff. variation',
icon: CircleIcon,
to: '/organization/pricing/variation-coefficients',
},
],
},

{ 
  divider: true,
  roles: ['admin']
},

// ─────────────────────────────────────────────────────────
// Abonnement
// ─────────────────────────────────────────────────────────
{ 
  header: 'Abonnement',
  roles: ['admin']
},

{
title: 'Mon abonnement',
icon: CreditCardIcon,
to: '/subscription',
roles: ['admin']
},
];

export const menu = adminMenu;
