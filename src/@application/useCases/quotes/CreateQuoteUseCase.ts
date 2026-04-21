import { QuoteMapper } from '@/@application/mappers/QuoteMapper';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { QuoteDto } from '@/@application/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateQuoteUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository) {}

  async execute(quoteDto: QuoteDto, userId: string): Promise<QuoteDto> {    
    // 🔹 1. Générer un numéro unique
    const quoteNumber = await this.quoteRepository.generateQuoteNumber(userId);
    
    // 🔹 2. Convertir le DTO en Entité pour appliquer les règles métiers
    const quote = QuoteMapper.dtoToDomain({
      ...quoteDto,
      id: crypto.randomUUID(),
      quoteNumber: quoteNumber,
      endDate: '', // 🔹 La date de fin est calculée par le système
      status: 'draft',
      userId, // L’utilisateur qui crée le devis
    });
  
    // 🔹 3. Appliquer d'éventuelles règles métier
    if (quote.isExpired())
      throw new Error("Impossible de créer un devis expiré");
  

    quoteDto.quoteNumber = quoteNumber;
    
    return quoteDto;
  }
  
}
