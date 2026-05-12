export const filterMenuByRole = (
  items: any[],
  role: string
) => {

  return items
    .map((item) => {

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
    .filter(Boolean);
};