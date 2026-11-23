import { IUserUseCase } from '@/features/users/application/useCases/UserUseCase';
import { IGetTechnicianStatsUseCase } from '@/features/technicians/application/useCases/GetTechnicianStatsUseCase';
import { ITechnicianGarageAccessRepository } from '@/features/technicians/application/ports/repositories/ITechnicianGarageAccessRepository';
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseTechnicianDetailState } from '@/features/technicians/presentation/composables/useTechnicianDetailState';

export function useTechnicianDetailState() {
  return createUseTechnicianDetailState({
    userUseCase: container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase),
    statsUseCase: container.get<IGetTechnicianStatsUseCase>(SYMBOLS.UseCases.TechnicianStats),
    garageAccessRepo: container.get<ITechnicianGarageAccessRepository>(SYMBOLS.Repositories.TechnicianGarageAccessRepository),
    quoteRepo: container.get<IQuoteRepository>(SYMBOLS.Repositories.QuoteRepository),
    invoiceRepo: container.get<IInvoiceRepository>(SYMBOLS.Repositories.InvoiceRepository),
  });
}
