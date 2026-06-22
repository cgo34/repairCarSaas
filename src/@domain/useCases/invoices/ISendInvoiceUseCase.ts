import { OrganizationProfileDto } from '@/@application/dtos/organizations/OrganizationProfileDto';

export interface ISendInvoiceUseCase {
  execute(invoiceId: string, company?: OrganizationProfileDto | null): Promise<void>;
}
