import { QuoteMapper } from '@/@application/mappers/QuoteMapper';
import { IQuoteRepository } from '@/@domain/repositories/IQuoteRepository';
import { QuoteDto } from '@/@infrastructure/dtos/QuoteDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateQuoteUseCase {
  constructor(@inject(SYMBOLS.Repositories.QuoteRepository) private quoteRepository: IQuoteRepository) {}

  async execute(quoteDto: QuoteDto, userId: string): Promise<QuoteDto> {
    console.log('CreateQuoteUseCase.execute', quoteDto, userId);
    
    // 🔹 1. Générer un numéro unique
    const quoteNumber = await this.quoteRepository.generateQuoteNumber();
    console.log('quoteNumber', quoteNumber);
    
    // 🔹 2. Convertir le DTO en Entité pour appliquer les règles métiers
    const quote = QuoteMapper.dtoToDomain({
      ...quoteDto,
      id: crypto.randomUUID(),
      quoteNumber: quoteNumber,
      endDate: '', // 🔹 La date de fin est calculée par le système
      status: 'draft',
      userId, // L’utilisateur qui crée le devis
    });
  console.log('quote', quote);
  
    // 🔹 3. Appliquer d'éventuelles règles métier
    if (quote.isExpired()) throw new Error("Impossible de créer un devis expiré");
  
    // 🔹 4. Sauvegarder l’entité convertie en DTO
    // await this.quoteRepository.create(QuoteMapper.domainToDto(quote));
  
    // 🔹 5. Retourner un DTO pour la couche Présentation
    // console.log('quote DTO aferter generete number', QuoteMapper.domainToDto(quote));

    quoteDto.quoteNumber = quoteNumber;
    
    return quoteDto;
  }
  
}
