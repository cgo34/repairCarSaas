import { QuoteMapper } from '@/@application/mappers/QuoteMapper';
import { QuoteLineItem } from '@/@domain/entities/QuoteLineItem';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class AddLineItemUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository) {}

  async execute(quoteId: string, lineItem: QuoteLineItem): Promise<QuoteDto> {
    // 🔹 1. Récupérer la Quote depuis le repository (DTO)
    const quoteDto = await this.quoteRepository.getById(quoteId);
    if (!quoteDto) throw new Error("Quote not found");

    // 🔹 2. Convertir DTO → Domain Model
    const quote = QuoteMapper.dtoToDomain(quoteDto);

    // 🔹 3. Ajouter la ligne au modèle de domaine
    quote.addLineItem(lineItem);

    // 🔹 4. Convertir Domain Model → DTO pour la persistance
    const updatedQuoteDto = QuoteMapper.domainToDto(quote);

    // 🔹 5. Enregistrer la mise à jour en base (DTO)
    await this.quoteRepository.update(updatedQuoteDto);

    // 🔹 6. Retourner l’entité en DTO pour la présentation
    return updatedQuoteDto;
  }
}
