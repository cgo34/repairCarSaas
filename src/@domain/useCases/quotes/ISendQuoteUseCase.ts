import { OrganizationProfileDto } from '@/@application/dtos/organizations/OrganizationProfileDto';

export interface ISendQuoteUseCase {
  execute(quoteId: string, company?: OrganizationProfileDto | null): Promise<void>;
}
