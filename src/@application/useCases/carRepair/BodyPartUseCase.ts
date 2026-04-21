import { BodyPartService } from "@/@application/services/carRepair/BodyPartService";
import { IBodyPartService } from "@/@domain/services/carRepair/IBodyPartService";
import { IBodyPartUseCase } from "@/@domain/useCases/carRepair/IBodyPartUseCase";
import { BodyPartViewModel } from "@/@presentation/types/models/carRepair/BodyPartViewModel";
import { BodyPartMapper } from "@/@presentation/mappers/settings/BodyPartMapper";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class BodyPartUseCase implements IBodyPartUseCase {
  constructor(
    @inject(SYMBOLS.Services.BodyPartService) private bodyPartService: IBodyPartService
  ) {
    if (!BodyPartService) {
      throw new Error('BodyPartService injection failed in BodyPartUseCase');
    }
  }

  async executeGetAll(): Promise<BodyPartViewModel[]> {
    const dtos = await this.bodyPartService.getAll();
    return dtos.map(BodyPartMapper.dtoToView);
  }

  async executeCreate(bodyPart: BodyPartViewModel): Promise<BodyPartViewModel> {
    const dto = BodyPartMapper.viewToDto(bodyPart);
    const created = await this.bodyPartService.create(dto);
    return BodyPartMapper.dtoToView(created);
  }

  async executeUpdate(bodyPart: BodyPartViewModel): Promise<BodyPartViewModel> {
    const dto = BodyPartMapper.viewToDto(bodyPart);
    const updated = await this.bodyPartService.update(dto);
    return BodyPartMapper.dtoToView(updated);
  }

  async executeDelete(id: string): Promise<void> {
    return this.bodyPartService.delete(id);
  }
}