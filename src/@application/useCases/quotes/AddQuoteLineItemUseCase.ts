import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { LineItemDto } from '@/@infrastructure/dtos/LineItemDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AddQuoteLineItemUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository,
    @inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository
  ) {}

  async executeQuote(quoteId: string, lineItems: LineItemDto[]): Promise<LineItemDto[]> {
    // 🔹 1. Récupérer la Quote depuis le repository (DTO)
    const quoteDto = await this.quoteRepository.getById(quoteId);
    
    if (!quoteDto)
      throw new Error("Quote not found");

    lineItems = lineItems.map(item => ({ ...item, quoteId: quoteId }));

    // 🔹 2. Convertir DTO → Domain Model
    // const quote = QuoteMapper.dtoToDomain(quoteDto);

    // 🔹 3. Ajouter la ligne au modèle de domaine
    // quote.addLineItem(lineItem);

    // 🔹 4. Convertir Domain Model → DTO pour la persistance
    console.log('executeQuote lineItems', lineItems);
    
    const updatedQuoteDto = await this.quoteDetailRepository.insert(lineItems);

    // 🔹 6. Retourner l’entité en DTO pour la présentation
    return updatedQuoteDto;
  }
}
