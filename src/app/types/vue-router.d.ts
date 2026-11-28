import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    subtitle?: string;
    allowInGlobalContext?: boolean;
    breadcrumb?: {
      title: string;
      disabled?: boolean;
      href: string;
    }[];
  }
}
