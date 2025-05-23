// 📌 Application: DuplicateQuoteToInvoiceUseCase.ts
import { LineItemMapper } from '@/@application/mappers/LineItemMapper';
import { QuoteMapper } from '@/@application/mappers/QuoteMapper';
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IInvoiceDetailRepository } from '@/@domain/repositories/IInvoiceDetailRepository';
import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { IGetDocumentStatuseUseCase } from '@/@domain/useCases/IGetDocumentStatuseUseCase';
import { InvoiceDto } from '@/@infrastructure/dtos/InvoiceDto';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class DuplicateQuoteToInvoiceUseCase {
  constructor(
    @inject(SYMBOLS.States.AuthState) private authState: IAuthState,
    @inject(SYMBOLS.UseCases.GetDocumentStatuse) private getDocumentStatuseUseCase: IGetDocumentStatuseUseCase,
    @inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository,
    @inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository,
    @inject(SYMBOLS.Repositories.InvoiceRepository) private invoiceRepository: IInvoiceRepository,
    @inject(SYMBOLS.Repositories.InvoiceDetailRepository) private invoiceDetailRepository: IInvoiceDetailRepository
  ) {}

  async execute(quote: QuoteDto, quoteLines: LineItemDto[]): Promise<InvoiceDto> {
    
      const pendingStatus = (await this.getDocumentStatuseUseCase.execute()).find(s => s.code === 'processing')
      const invoicedStatus = (await this.getDocumentStatuseUseCase.execute()).find(s => s.code === 'invoiced')
    console.log('DuplicateQuoteToInvoiceUseCase', quote, quoteLines);

    
    
    const invoiceNumber = await this.invoiceRepository.generateInvoiceNumber(this.authState.user.value.id);
    console.log('invoiceNumber', invoiceNumber);
    
    let invoice = QuoteMapper.quoteToInvoice(quote)
    invoice = {
      ...invoice,
      invoiceNumber: invoiceNumber,
      status_id: pendingStatus?.id,
      status: pendingStatus
    }
    console.log('invoice', invoice);



    
    // const invoiceLines = QuoteMapper.quoteLinesToInvoiceLines(quoteLines)
    
    const invoiceCreate = await this.invoiceRepository.create(invoice)
    
    let invoiceLines = quoteLines.map(LineItemMapper.quoteLineToInvoice)
    invoiceLines = invoiceLines.map(line => {
      return { ...line, invoiceId: invoiceCreate.id}
    })

    await this.invoiceDetailRepository.insertMultiple(invoiceLines)
    await this.quoteRepository.updateStatus(quote.id, invoicedStatus?.id); // to be call on composable after duplicate success and call use case and redirect to invoice page after

    return invoiceCreate
  }
}
