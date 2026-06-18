import { QuoteDto } from '@/@application/dtos/QuoteDto';

export interface IQuotesUseCase {
  execute(organizationId: string, memberId: string, role: 'admin' | 'manager' | 'technician'): Promise<QuoteDto[]>;
}
