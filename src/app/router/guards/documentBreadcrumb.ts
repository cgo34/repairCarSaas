type DocumentFeature = 'quotes' | 'invoices';

export interface BreadcrumbItem {
  title: string;
  href: string;
}

// Breadcrumb of the PDF preview. Its parent depends on whether the document
// can still be edited: "Modifier" for a draft, "Consulter" once it is locked.
// Built in the guard so the right crumb is displayed from the first render.
export const buildPreviewBreadcrumb = (feature: DocumentFeature, locked: boolean): BreadcrumbItem[] => {
  const base = `/${feature}`;
  const parent = locked ? 'view' : 'edit';

  return [
    { title: `${feature}.breadcrumb.list`, href: base },
    { title: `${feature}.breadcrumb.${parent}`, href: `${base}/${parent}` },
    { title: `${feature}.breadcrumb.preview`, href: `${base}/preview` },
  ];
};
