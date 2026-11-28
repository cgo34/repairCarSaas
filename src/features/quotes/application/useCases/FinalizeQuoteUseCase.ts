import { IViewQuoteUseCase } from '@/features/quotes/application/useCases/ViewQuoteUseCase';
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { DocumentStatusDto } from '@/features/documentStatuses/application/dtos/DocumentStatusDto';
import { EMPTY_QUOTE_ERROR } from '@/features/quotes/application/useCases/SendQuoteUseCase';

export interface IFinalizeQuoteUseCase {
  execute(quoteId: string): Promise<DocumentStatusDto>;
}

/** Valide un devis (« En attente ») sans l'envoyer par email : remise en main propre ou par PDF. */
export class FinalizeQuoteUseCase implements IFinalizeQuoteUseCase {
  constructor(
    private readonly viewQuoteUseCase: IViewQuoteUseCase,
    private readonly quoteRepository: IQuoteRepository,
    private readonly getDocumentStatusUseCase: IGetDocumentStatusUseCase,
  ) {}

  async execute(quoteId: string): Promise<DocumentStatusDto> {
    const { quote, lines } = await this.viewQuoteUseCase.execute(quoteId);

    if (!quote || !lines) {
      throw new Error('Quote or quote details not found');
    }

    const hasItems = quote.isForfait ? Number(quote.forfaitAmount ?? 0) > 0 : lines.length > 0;
    if (!hasItems) {
      throw new Error(EMPTY_QUOTE_ERROR);
    }

    await this.quoteRepository.markAsSent(quoteId);

    const pendingStatus = await this.getDocumentStatusUseCase.getByCode('pending');
    if (!pendingStatus?.id) throw new Error('Statut introuvable : pending');
    await this.quoteRepository.updateStatus(quoteId, pendingStatus.id);
    return pendingStatus;
  }
}
