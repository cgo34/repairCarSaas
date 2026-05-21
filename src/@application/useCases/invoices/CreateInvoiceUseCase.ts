import { InvoiceMapper } from '@/@application/mappers/InvoiceMapper';
import { IInvoiceRepository } from '@/@domain/repositories/IInvoiceRepository';
import { InvoiceDto } from '@/@application/dtos/InvoiceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateInvoiceUseCase {
  constructor(@inject(SYMBOLS.Repositories.InvoiceRepository) private invoiceRepository: IInvoiceRepository) {}

  async execute(organizationId: string): Promise<InvoiceDto> {    
    // 🔹 1. Générer un numéro unique
    const invoiceNumber = await this.invoiceRepository.generateInvoiceNumber(organizationId);
    
    // 🔹 2. Convertir le DTO en Entité pour appliquer les règles métiers
    // const invoice = InvoiceMapper.dtoToDomain({
    //   ...invoiceDto,
    //   id: crypto.randomUUID(),
    //   invoiceNumber: invoiceNumber,
    //   endDate: '', // 🔹 La date de fin est calculée par le système
    //   status: 'draft',
    //   userId, // L’utilisateur qui crée le devis
    // });
  
    // 🔹 3. Appliquer d'éventuelles règles métier
    // if (invoice.isExpired())
    //   throw new Error("Impossible de créer un devis expiré");
  

    // invoiceDto.invoiceNumber = invoiceNumber;
    
    return invoiceNumber;
  }
  
}
