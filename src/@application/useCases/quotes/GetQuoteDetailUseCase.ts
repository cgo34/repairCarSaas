// 📌 Application: GetQuoteUseCase.ts

import { IQuoteDetailRepository } from '@/@domain/repositories/IQuoteDetailRepository';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { IDentRepairTypeUseCase } from '@/@domain/useCases/carRepair/IDentRepairTypeUseCase';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { LineItemViewMapper } from '@/@presentation/mappers/LineItemViewMapper';

@injectable()
export class GetQuoteDetailUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.QuoteDetailRepository) private quoteDetailRepository: IQuoteDetailRepository,
    @inject(SYMBOLS.UseCases.CarRepair.BodyPartUseCase) private bodyPartUseCase: IBodyPartUseCase,
    @inject(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase) private bodyMaterialUseCase: IBodyMaterialUseCase,
    @inject(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase) private repairTypeUseCase: IDentRepairTypeUseCase
  ) {}

  async execute(id: string): Promise<LineItemViewModel[] | null> {
    const [dtos, bodyParts, bodyMaterials, repairTypes] = await Promise.all([
      this.quoteDetailRepository.get(id),
      this.bodyPartUseCase.executeGetAll(),
      this.bodyMaterialUseCase.executeGetAll(),
      this.repairTypeUseCase.executeGetAll(),
    ]);
    if (!dtos) return null;
    return dtos.map(dto => LineItemViewMapper.dtoToViewEnriched(dto, bodyParts, bodyMaterials, repairTypes));
  }
}
