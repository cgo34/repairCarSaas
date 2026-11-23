import { IAuthState } from "@/features/auth/presentation/state/IAuthState";
import { IQuotesUseCase } from '@/features/quotes/application/useCases/GetQuotesUseCase';
import { IDeleteQuoteUseCase } from '@/features/quotes/application/useCases/DeleteQuoteUseCase';
import { ISendQuoteUseCase } from '@/features/quotes/application/useCases/SendQuoteUseCase';
import { IGetQuoteUseCase } from '@/features/quotes/application/useCases/GetQuoteUseCase';
import { IGetQuoteDetailUseCase } from '@/features/quotes/application/useCases/GetQuoteDetailUseCase';
import { IDuplicateQuoteToInvoiceUseCase } from '@/features/quotes/application/useCases/DuplicateQuoteToInvoiceUseCase';
import { IUpdateStatusQuoteUseCase } from '@/features/quotes/application/useCases/UpdateStatusQuoteUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseQuotesState } from '@/features/quotes/presentation/composables/useQuotesState';

export function useQuotesState() {
  return createUseQuotesState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    getQuotesUseCase: container.get<IQuotesUseCase>(SYMBOLS.UseCases.Quote.GetQuotesUseCase),
    deleteQuoteUseCase: container.get<IDeleteQuoteUseCase>(SYMBOLS.UseCases.Quote.DeleteQuoteUseCase),
    sendQuoteUseCase: container.get<ISendQuoteUseCase>(SYMBOLS.UseCases.Quote.SendQuoteUseCase),
    getQuoteUseCase: container.get<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase),
    getQuoteDetailUseCase: container.get<IGetQuoteDetailUseCase>(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase),
    duplicateQuoteToInvoiceUseCase: container.get<IDuplicateQuoteToInvoiceUseCase>(SYMBOLS.UseCases.Quote.DuplicateQuoteToInvoiceUseCase),
    updateStatusQuoteUseCase: container.get<IUpdateStatusQuoteUseCase>(SYMBOLS.UseCases.Quote.UpdateStatusQuoteUseCase),
  });
}
