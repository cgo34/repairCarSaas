import { QuoteLineItem } from '@/@domain/entities/QuoteLineItem';
import { QuoteLineItemDto } from '@/@application/dtos/QuoteLineItemDto';

export class QuoteLineItemMapper {
  static dtoToDomain(dto: QuoteLineItemDto): QuoteLineItem {
    return new QuoteLineItem(
      dto.id ?? '',
      dto.quoteId,
      dto.bodyPartId,
      dto.bodyMaterialId,
      dto.repairTypeId,
      dto.impactCount25,
      dto.impactCount35,
      dto.dentRemovalPrice,
      dto.price
    );
  }

  static domainToDto(domain: QuoteLineItem): QuoteLineItemDto {
    return {
      id: domain.id,
      quoteId: domain.quoteId,
      bodyPartId: domain.bodyPartId,
      bodyMaterialId: domain.bodyMaterialId,
      repairTypeId: domain.repairTypeId,
      impactCount25: domain.impactCount25,
      impactCount35: domain.impactCount35,
      degarnissagePrice: domain.degarnissagePrice,
      price: domain.price
    };
  }
}
