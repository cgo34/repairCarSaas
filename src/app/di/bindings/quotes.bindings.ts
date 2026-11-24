import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { QuoteDetailRepository } from '@/features/quotes/infrastructure/repositories/QuoteDetailRepository';
import { AddQuoteLineItemUseCase } from '@/features/quotes/application/useCases/AddQuoteLineItemUseCase';
import { IUpdateQuoteLineItemUseCase, UpdateQuoteLineItemUseCase } from '@/features/quotes/application/useCases/UpdateQuoteLineItemUseCase';
import { CreateQuoteUseCase } from '@/features/quotes/application/useCases/CreateQuoteUseCase';
import { DeleteQuoteUseCase } from '@/features/quotes/application/useCases/DeleteQuoteUseCase';
import { DuplicateQuoteToInvoiceUseCase } from '@/features/quotes/application/useCases/DuplicateQuoteToInvoiceUseCase';
import { GenerateQuotePdfUseCase } from '@/features/quotes/application/useCases/GenerateQuotePdfUseCase';
import { GetQuoteDetailUseCase } from '@/features/quotes/application/useCases/GetQuoteDetailUseCase';
import { GetQuotesUseCase } from '@/features/quotes/application/useCases/GetQuotesUseCase';
import { GetQuoteUseCase } from '@/features/quotes/application/useCases/GetQuoteUseCase';
import { InsertQuoteUseCase } from '@/features/quotes/application/useCases/InsertQuoteUseCase';
import { SendQuoteUseCase } from '@/features/quotes/application/useCases/SendQuoteUseCase';
import { UpdateQuoteUseCase } from '@/features/quotes/application/useCases/UpdateQuoteUseCase';
import { UpdateStatusQuoteUseCase } from '@/features/quotes/application/useCases/UpdateStatusQuoteUseCase';
import { ViewQuoteUseCase } from '@/features/quotes/application/useCases/ViewQuoteUseCase';
import { IQuoteDetailRepository } from '@/features/quotes/application/ports/repositories/IQuoteDetailRepository';
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { IAddQuoteLineItemUseCase } from '@/features/quotes/application/useCases/AddQuoteLineItemUseCase';
import { ICreateQuoteUseCase } from '@/features/quotes/application/useCases/CreateQuoteUseCase';
import { IDeleteQuoteUseCase } from '@/features/quotes/application/useCases/DeleteQuoteUseCase';
import { IDuplicateQuoteToInvoiceUseCase } from '@/features/quotes/application/useCases/DuplicateQuoteToInvoiceUseCase';
import { IGenerateQuotePdfUseCase } from '@/features/quotes/application/useCases/GenerateQuotePdfUseCase';
import { IGetQuoteDetailUseCase } from '@/features/quotes/application/useCases/GetQuoteDetailUseCase';
import { IGetQuoteUseCase } from '@/features/quotes/application/useCases/GetQuoteUseCase';
import { IInsertQuoteUseCase } from '@/features/quotes/application/useCases/InsertQuoteUseCase';
import { IQuotesUseCase } from '@/features/quotes/application/useCases/GetQuotesUseCase';
import { ISendQuoteUseCase } from '@/features/quotes/application/useCases/SendQuoteUseCase';
import { IUpdateQuoteUseCase } from '@/features/quotes/application/useCases/UpdateQuoteUseCase';
import { IUpdateStatusQuoteUseCase } from '@/features/quotes/application/useCases/UpdateStatusQuoteUseCase';
import { IViewQuoteUseCase } from '@/features/quotes/application/useCases/ViewQuoteUseCase';
import { useCreateQuoteState } from '@/features/quotes/composition/useCreateQuoteState';
import { useEditQuoteState } from '@/features/quotes/composition/useEditQuoteState';
import { useQuotesState } from '@/features/quotes/composition/useQuotesState';
import { useViewQuoteState } from '@/features/quotes/composition/useViewQuoteState';
import { IUseCreateQuoteState } from '@/features/quotes/presentation/types/IUseCreateQuoteState';
import { IUseEditQuoteState } from '@/features/quotes/presentation/types/IUseEditQuoteState';
import { IUseQuotesState } from '@/features/quotes/presentation/types/IUseQuotesState';
import { IUseViewQuoteState } from '@/features/quotes/presentation/types/IUseViewQuoteState';
import { QuoteRepository } from '@/features/quotes/infrastructure/repositories/QuoteRepository';

export function registerQuotesBindings(container: Container): void {
  container.bind<IQuoteRepository>(SYMBOLS.Repositories.QuoteRepository).toDynamicValue(ctx => new QuoteRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IQuoteDetailRepository>(SYMBOLS.Repositories.QuoteDetailRepository).toDynamicValue(ctx => new QuoteDetailRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IQuotesUseCase>(SYMBOLS.UseCases.Quote.GetQuotesUseCase).toDynamicValue(ctx => new GetQuotesUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteRepository))).inSingletonScope();
  container.bind<IViewQuoteUseCase>(SYMBOLS.UseCases.Quote.ViewQuoteUseCase).toDynamicValue(ctx => new ViewQuoteUseCase(ctx.container.get(SYMBOLS.UseCases.Quote.GetQuoteUseCase), ctx.container.get(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase))).inSingletonScope();
  container.bind<ICreateQuoteUseCase>(SYMBOLS.UseCases.Quote.CreateQuoteUseCase).toDynamicValue(ctx => new CreateQuoteUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteRepository))).inSingletonScope();
  container.bind<IInsertQuoteUseCase>(SYMBOLS.UseCases.Quote.InsertQuoteUseCase).toDynamicValue(ctx => new InsertQuoteUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteRepository), ctx.container.get(SYMBOLS.UseCases.GetDocumentStatus))).inSingletonScope();
  container.bind<IUpdateQuoteUseCase>(SYMBOLS.UseCases.Quote.UpdateQuoteUseCase).toDynamicValue(ctx => new UpdateQuoteUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteRepository), ctx.container.get(SYMBOLS.UseCases.GetDocumentStatus))).inSingletonScope();
  container.bind<IDeleteQuoteUseCase>(SYMBOLS.UseCases.Quote.DeleteQuoteUseCase).toDynamicValue(ctx => new DeleteQuoteUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteRepository))).inSingletonScope();
  container.bind<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase).toDynamicValue(ctx => new GetQuoteUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteRepository))).inSingletonScope();
  container.bind<IGetQuoteDetailUseCase>(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase).toDynamicValue(ctx => new GetQuoteDetailUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteDetailRepository))).inSingletonScope();
  container.bind<IUpdateStatusQuoteUseCase>(SYMBOLS.UseCases.Quote.UpdateStatusQuoteUseCase).toDynamicValue(ctx => new UpdateStatusQuoteUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteRepository), ctx.container.get(SYMBOLS.UseCases.GetDocumentStatus))).inSingletonScope();
  container.bind<IAddQuoteLineItemUseCase>(SYMBOLS.UseCases.Quote.AddLineItemUseCase).toDynamicValue(ctx => new AddQuoteLineItemUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteRepository), ctx.container.get(SYMBOLS.Repositories.QuoteDetailRepository))).inSingletonScope();
  container.bind<IGenerateQuotePdfUseCase>(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase).toDynamicValue(ctx => new GenerateQuotePdfUseCase(ctx.container.get(SYMBOLS.Services.PdfGeneratorService))).inSingletonScope();
  container.bind<ISendQuoteUseCase>(SYMBOLS.UseCases.Quote.SendQuoteUseCase).toDynamicValue(ctx => new SendQuoteUseCase(ctx.container.get(SYMBOLS.UseCases.Quote.ViewQuoteUseCase), ctx.container.get(SYMBOLS.UseCases.Quote.GenerateQuotePdfUseCase), ctx.container.get(SYMBOLS.Services.EmailService), ctx.container.get(SYMBOLS.Repositories.QuoteRepository), ctx.container.get(SYMBOLS.UseCases.OrganizationProfileUseCase), ctx.container.get(SYMBOLS.UseCases.GetDocumentStatus)));
  container.bind<IDuplicateQuoteToInvoiceUseCase>(SYMBOLS.UseCases.Quote.DuplicateQuoteToInvoiceUseCase).toDynamicValue(ctx => new DuplicateQuoteToInvoiceUseCase(ctx.container.get(SYMBOLS.States.AuthState), ctx.container.get(SYMBOLS.UseCases.GetDocumentStatus), ctx.container.get(SYMBOLS.Repositories.QuoteRepository), ctx.container.get(SYMBOLS.Repositories.QuoteDetailRepository), ctx.container.get(SYMBOLS.Repositories.InvoiceRepository), ctx.container.get(SYMBOLS.Repositories.InvoiceDetailRepository))).inSingletonScope();
  container.bind<IUpdateQuoteLineItemUseCase>(SYMBOLS.UseCases.Quote.UpdateLineItemUseCase).toDynamicValue(ctx => new UpdateQuoteLineItemUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteDetailRepository))).inSingletonScope();
  container.bind<IUseCreateQuoteState>(SYMBOLS.States.Quote.CreateQuoteState).toDynamicValue(() => {
    return useCreateQuoteState();
  });
  container.bind<IUseViewQuoteState>(SYMBOLS.States.Quote.ViewQuoteState).toDynamicValue(() => {
    return useViewQuoteState();
  });
  container.bind<IUseEditQuoteState>(SYMBOLS.States.Quote.EditQuoteState).toDynamicValue(() => {
    return useEditQuoteState();
  });
  container.bind<IUseQuotesState>(SYMBOLS.States.Quote.GetQuotesUseCase).toDynamicValue(() => {
    return useQuotesState();
  });
}
