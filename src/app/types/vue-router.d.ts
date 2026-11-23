import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    subtitle?: string;
    breadcrumb?: {
      title: string;
      disabled?: boolean;
      href: string;
    }[];
  }
}
