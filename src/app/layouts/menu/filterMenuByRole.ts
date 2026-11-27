import type { Component } from 'vue';

export interface MenuItem {
  title?: string;
  header?: string;
  divider?: boolean;
  icon?: Component;
  to?: string;
  roles?: string[];
  children?: MenuItem[];
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  alert?: boolean;
}

export const filterMenuByRole = (
  items: MenuItem[],
  role: string
): MenuItem[] => {

  return items
    .map((item): MenuItem | null => {

      // check roles
      if (
        item.roles &&
        !item.roles.includes(role)
      ) {
        return null;
      }

      // divider
      if (item.divider) {
        return item;
      }

      // header
      if (item.header) {
        return item;
      }

      // children
      if (item.children) {

        const children =
          filterMenuByRole(
            item.children,
            role
          );

        if (!children.length) {
          return null;
        }

        return {
          ...item,
          children
        };
      }

      return item;
    })
    .filter((item): item is MenuItem => item !== null);
};