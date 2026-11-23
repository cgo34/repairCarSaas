// ðŸ“Œ Application: DuplicateQuoteToInvoiceUseCase.ts
import { LineItemMapper } from '@/features/lineItems/application/mappers/LineItemMapper';
import { QuoteMapper } from '@/features/quotes/application/mappers/QuoteMapper';
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IInvoiceDetailRepository } from '@/features/invoices/application/ports/repositories/IInvoiceDetailRepository';
import { IInvoiceRepository } from '@/features/invoices/application/ports/repositories/IInvoiceRepository';
import { IQuoteDetailRepository } from '@/features/quotes/application/ports/repositories/IQuoteDetailRepository';
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { InvoiceDto } from '@/features/invoices/application/dtos/InvoiceDto';
import { LineItemDto } from '@/features/lineItems/application/dtos/LineItemDto';
import { QuoteDto } from '@/features/quotes/application/dtos/QuoteDto';

export interface IDuplicateQuoteToInvoiceUseCase {
  execute(quoteDto: QuoteDto, quoteLines: LineItemDto[]): Promise<InvoiceDto>;
}

export class DuplicateQuoteToInvoiceUseCase {
  constructor(
    private authState: IAuthState,
    private getDocumentStatusUseCase: IGetDocumentStatusUseCase,
    private quoteRepository: IQuoteRepository,
    private quoteDetailRepository: IQuoteDetailRepository,
    private invoiceRepository: IInvoiceRepository,
    private invoiceDetailRepository: IInvoiceDetailRepository
  ) {}

  async execute(quote: QuoteDto, quoteLines: LineItemDto[]): Promise<InvoiceDto> {
      const pendingStatus = (await this.getDocumentStatusUseCase.execute()).find(s => s.code === 'processing')
    
    const userContext = this.authState.userContext.value;
    if (!userContext) throw new Error('User not found');

    if (!quote.id) throw new Error('Quote id is required to duplicate it to an invoice');
    if (quote.status?.code !== 'accepted') throw new Error('Seul un devis accepté peut être converti en facture');
    if (quote.convertToInvoice) throw new Error('Ce devis a déjà été converti en facture');
    if (!pendingStatus) throw new Error('Document statuses not found');

    const invoiceNumber = await this.invoiceRepository.generateInvoiceNumber(userContext.organization.id);
    
    let invoice = QuoteMapper.quoteToInvoice(quote, invoiceNumber)

    invoice = {
      ...invoice,
      invoiceNumber: invoiceNumber,
      // Set new status for invoice
      status_id: pendingStatus.id,
      status: pendingStatus
    }
    
    // const invoiceLines = QuoteMapper.quoteLinesToInvoiceLines(quoteLines)
    
    const invoiceCreate = await this.invoiceRepository.create(invoice)
    
    let invoiceLines = quoteLines.map(LineItemMapper.quoteLineToInvoice)
    invoiceLines = invoiceLines.map(line => {
      return { ...line, invoiceId: invoiceCreate.id}
    })

    await this.invoiceDetailRepository.insertMultiple(invoiceLines)
    await this.quoteRepository.markAsConverted(quote.id);

    return invoiceCreate
  }
}
