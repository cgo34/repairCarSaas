// TODO: (GCE) -> NOT USE FOR THE MOMENT
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';

export interface IQuotesUseCase {
  execute(organizationId: string, memberId: string, role: 'admin' | 'manager' | 'technician'): Promise<QuoteDto[]>;
}

export class GetQuotesUseCase {
  constructor(private quoteRepository: IQuoteRepository) {}


  async execute(organizationId: string, memberId: string, role: 'admin' | 'manager' | 'technician') {
    return await this.quoteRepository.getAllByOrganizationMemberId(organizationId, memberId, role);
  }
}
