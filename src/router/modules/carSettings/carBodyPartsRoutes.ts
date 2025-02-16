// src/router/modules/carSettings/carBodyPartsRoutes.ts
import CarBodyPartPage from '@/@presentation/@modules/settings/carRepair/pages/CarBodyPartPage.vue';

export const carBodyPartsRoutes = [
  {
    path: '/car-body-parts',
    name: 'CarBodyPartsList',
    component: CarBodyPartPage,
    meta: {
      breadcrumb: [
        { title: 'Home', href: '/' },
        { title: 'Settings', href: '/settings' },
        { title: 'Car Body Parts', href: '/car-body-parts' }
      ]
    }
  },
  {
    path: '/car-body-parts/:id',
    name: 'CarBodyPartDetail',
    component: CarBodyPartPage,
    meta: {
      breadcrumb: [
        { title: 'Home', href: '/' },
        { title: 'Settings', href: '/settings' },
        { title: 'Car Body Parts', href: '/car-body-parts' },
        { title: 'Detail', href: '' }
      ]
    }
  }
];