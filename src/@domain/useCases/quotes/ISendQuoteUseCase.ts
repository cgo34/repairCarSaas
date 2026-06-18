import { CompanySettingsDto } from '@/@application/dtos/CompanySettingsDto';

export interface ISendQuoteUseCase {
  execute(quoteId: string, company?: CompanySettingsDto | null): Promise<void>;
}
