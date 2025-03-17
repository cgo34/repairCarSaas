import { QuoteLineItem } from '@/@domain/entities/QuoteLineItem';
import { QuoteLineItemDto } from '@/@infrastructure/dtos/QuoteLineItemDto';

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
      dto.strippingPercentage,
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
      strippingPercentage: domain.strippingPercentage,
      price: domain.price
    };
  }
}
