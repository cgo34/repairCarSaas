import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';

export interface ISendInvoiceUseCase {
  execute(invoiceId: string, company?: CompanySettingsDto | null): Promise<void>;
}
