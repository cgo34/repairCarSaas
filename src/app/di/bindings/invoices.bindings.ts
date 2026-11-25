import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { AddInvoiceLineItemUseCase } from '@/features/invoices/application/useCases/AddInvoiceLineItemUseCase';
import { CreateInvoiceUseCase } from '@/features/invoices/application/useCases/CreateInvoiceUseCase';
import { DeleteInvoiceUseCase } from '@/features/invoices/application/useCases/DeleteInvoiceUseCase';
import { GenerateInvoicePdfUseCase } from '@/features/invoices/application/useCases/GenerateInvoicePdfUseCase';
import { GetInvoiceDetailUseCase } from '@/features/invoices/application/useCases/GetInvoiceDetailUseCase';
import { GetInvoicesUseCase } from '@/features/invoices/application/useCases/GetInvoicesUseCase';
import { GetInvoiceUseCase } from '@/features/invoices/application/useCases/GetInvoiceUseCase';
import { InsertInvoiceUseCase } from '@/features/invoices/application/useCases/InsertInvoiceUseCase';
import { SendInvoiceUseCase } from '@/features/invoices/application/useCases/SendInvoiceUseCase';
import { UpdateInvoiceUseCase } from '@/features/invoices/application/useCases/UpdateInvoiceUseCase';
import { ViewInvoiceUseCase } from '@/features/invoices/application/useCases/ViewInvoiceUseCase';
import { IInvoiceDetailRepository } from '@/features/invoices/application/ports/repositories/IInvoiceDetailRepository';
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { IAddInvoiceLineItemUseCase } from '@/features/invoices/application/useCases/AddInvoiceLineItemUseCase';
import { IUpdateInvoiceLineItemUseCase, UpdateInvoiceLineItemUseCase } from '@/features/invoices/application/useCases/UpdateInvoiceLineItemUseCase';
import { ICreateInvoiceUseCase } from '@/features/invoices/application/useCases/CreateInvoiceUseCase';
import { IDeleteInvoiceUseCase } from '@/features/invoices/application/useCases/DeleteInvoiceUseCase';
import { MarkInvoiceAsPaidUseCase, IMarkInvoiceAsPaidUseCase } from '@/features/invoices/application/useCases/MarkInvoiceAsPaidUseCase';
import { IGenerateInvoicePdfUseCase } from '@/features/invoices/application/useCases/GenerateInvoicePdfUseCase';
import { IGetInvoiceDetailUseCase } from '@/features/invoices/application/useCases/GetInvoiceDetailUseCase';
import { IGetInvoiceUseCase } from '@/features/invoices/application/useCases/GetInvoiceUseCase';
import { IInsertInvoiceUseCase } from '@/features/invoices/application/useCases/InsertInvoiceUseCase';
import { IInvoicesUseCase } from '@/features/invoices/application/useCases/GetInvoicesUseCase';
import { CountInvoicesThisMonthUseCase, ICountInvoicesThisMonthUseCase } from '@/features/invoices/application/useCases/CountInvoicesThisMonthUseCase';
import { ISendInvoiceUseCase } from '@/features/invoices/application/useCases/SendInvoiceUseCase';
import { IUpdateInvoiceUseCase } from '@/features/invoices/application/useCases/UpdateInvoiceUseCase';
import { IViewInvoiceUseCase } from '@/features/invoices/application/useCases/ViewInvoiceUseCase';
import { useCreateInvoiceState } from '@/features/invoices/composition/useCreateInvoiceState';
import { useEditInvoiceState } from '@/features/invoices/composition/useEditInvoiceState';
import { useInvoicesState } from '@/features/invoices/composition/useInvoicesState';
import { useViewInvoiceState } from '@/features/invoices/composition/useViewInvoiceState';
import { IUseCreateInvoiceState } from '@/features/invoices/presentation/types/IUseCreateInvoiceState';
import { IUseEditInvoiceState } from '@/features/invoices/presentation/types/IUseEditInvoiceState';
import { IUseInvoicesState } from '@/features/invoices/presentation/types/IUseInvoicesStates';
import { IUseViewInvoiceState } from '@/features/invoices/presentation/types/IUseViewInvoiceState';
import { InvoiceDetailRepository } from '@/features/invoices/infrastructure/repositories/InvoiceDetailRepository';
import { InvoiceRepository } from '@/features/invoices/infrastructure/repositories/InvoiceRepository';

export function registerInvoicesBindings(container: Container): void {
  container.bind<IInvoiceRepository>(SYMBOLS.Repositories.InvoiceRepository).toDynamicValue(ctx => new InvoiceRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IInvoiceDetailRepository>(SYMBOLS.Repositories.InvoiceDetailRepository).toDynamicValue(ctx => new InvoiceDetailRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<ICountInvoicesThisMonthUseCase>(SYMBOLS.UseCases.Invoice.CountInvoicesThisMonthUseCase).toDynamicValue(ctx => new CountInvoicesThisMonthUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceRepository))).inSingletonScope();
  container.bind<IInvoicesUseCase>(SYMBOLS.UseCases.Invoice.GetInvoicesUseCase).toDynamicValue(ctx => new GetInvoicesUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceRepository))).inSingletonScope();
  container.bind<IViewInvoiceUseCase>(SYMBOLS.UseCases.Invoice.ViewInvoiceUseCase).toDynamicValue(ctx => new ViewInvoiceUseCase(ctx.container.get(SYMBOLS.UseCases.Invoice.GetInvoiceUseCase), ctx.container.get(SYMBOLS.UseCases.Invoice.GetInvoiceDetailsUseCase))).inSingletonScope();
  container.bind<ICreateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.CreateInvoiceUseCase).toDynamicValue(ctx => new CreateInvoiceUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceRepository))).inSingletonScope();
  container.bind<IInsertInvoiceUseCase>(SYMBOLS.UseCases.Invoice.InsertInvoiceUseCase).toDynamicValue(ctx => new InsertInvoiceUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceRepository))).inSingletonScope();
  container.bind<IUpdateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.UpdateInvoiceUseCase).toDynamicValue(ctx => new UpdateInvoiceUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceRepository))).inSingletonScope();
  container.bind<IMarkInvoiceAsPaidUseCase>(SYMBOLS.UseCases.Invoice.MarkInvoiceAsPaidUseCase).toDynamicValue(ctx => new MarkInvoiceAsPaidUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceRepository), ctx.container.get(SYMBOLS.UseCases.GetDocumentStatus))).inSingletonScope();
  container.bind<IDeleteInvoiceUseCase>(SYMBOLS.UseCases.Invoice.DeleteInvoiceUseCase).toDynamicValue(ctx => new DeleteInvoiceUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceRepository), ctx.container.get(SYMBOLS.Repositories.QuoteRepository))).inSingletonScope();
  container.bind<IUpdateInvoiceLineItemUseCase>(SYMBOLS.UseCases.Invoice.UpdateLineItemUseCase).toDynamicValue(ctx => new UpdateInvoiceLineItemUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceDetailRepository))).inSingletonScope();
  container.bind<IGetInvoiceUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceUseCase).toDynamicValue(ctx => new GetInvoiceUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceRepository))).inSingletonScope();
  container.bind<IGetInvoiceDetailUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceDetailsUseCase).toDynamicValue(ctx => new GetInvoiceDetailUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceDetailRepository))).inSingletonScope();
  container.bind<IAddInvoiceLineItemUseCase>(SYMBOLS.UseCases.Invoice.AddLineItemUseCase).toDynamicValue(ctx => new AddInvoiceLineItemUseCase(ctx.container.get(SYMBOLS.Repositories.InvoiceRepository), ctx.container.get(SYMBOLS.Repositories.InvoiceDetailRepository))).inSingletonScope();
  container.bind<IGenerateInvoicePdfUseCase>(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase).toDynamicValue(ctx => new GenerateInvoicePdfUseCase(ctx.container.get(SYMBOLS.Services.PdfGeneratorService))).inSingletonScope();
  container.bind<ISendInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SendInvoiceUseCase).toDynamicValue(ctx => new SendInvoiceUseCase(ctx.container.get(SYMBOLS.UseCases.Invoice.ViewInvoiceUseCase), ctx.container.get(SYMBOLS.UseCases.Invoice.GenerateInvoicePdfUseCase), ctx.container.get(SYMBOLS.Services.EmailService), ctx.container.get(SYMBOLS.Repositories.InvoiceRepository), ctx.container.get(SYMBOLS.UseCases.OrganizationProfileUseCase), ctx.container.get(SYMBOLS.UseCases.GetDocumentStatus)));
  container.bind<IUseCreateInvoiceState>(SYMBOLS.States.Invoice.CreateInvoiceState).toDynamicValue(() => {
    return useCreateInvoiceState();
  });
  container.bind<IUseViewInvoiceState>(SYMBOLS.States.Invoice.ViewInvoiceState).toDynamicValue(() => {
    return useViewInvoiceState();
  });
  container.bind<IUseEditInvoiceState>(SYMBOLS.States.Invoice.EditInvoiceState).toDynamicValue(() => {
    return useEditInvoiceState();
  });
  container.bind<IUseInvoicesState>(SYMBOLS.States.Invoice.GetInvoicesUseCase).toDynamicValue(() => {
    return useInvoicesState();
  });
}
