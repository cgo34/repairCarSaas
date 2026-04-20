import { IBodyMaterialService } from "@/@domain/services/carRepair/IBodyMaterialService";
import { IBodyMaterialUseCase } from "@/@domain/useCases/carRepair/IBodyMaterialUseCase";
import { BodyMaterialDto } from "@/@infrastructure/dtos/carRepair/BodyMaterialDto";
import { BodyMaterialViewModel } from "@/@presentation/types/models/carRepair/BodyMaterialViewModel";
import { BodyMaterialMapper } from "@/@presentation/mappers/settings/BodyMaterialMapper";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class BodyMaterialUseCase implements IBodyMaterialUseCase {
  constructor(
    @inject(SYMBOLS.Services.BodyMaterialService) private bodyMaterialService: IBodyMaterialService
  ) {
    if (!bodyMaterialService) {
      throw new Error('bodyMaterialService injection failed in BodyMaterialUseCase');
    }
  }

  async executeGetAll(): Promise<BodyMaterialViewModel[]> {
    const dtos = await this.bodyMaterialService.getAll();
    return dtos.map(BodyMaterialMapper.dtoToView);
  }

  async executeCreate(bodyMaterial: BodyMaterialViewModel): Promise<BodyMaterialViewModel> {
    const dto = BodyMaterialMapper.viewToDto(bodyMaterial);
    const created = await this.bodyMaterialService.create(dto);
    return BodyMaterialMapper.dtoToView(created);
  }

  async executeUpdate(bodyMaterial: BodyMaterialViewModel): Promise<BodyMaterialViewModel> {
    const dto = BodyMaterialMapper.viewToDto(bodyMaterial);
    const updated = await this.bodyMaterialService.update(dto);
    return BodyMaterialMapper.dtoToView(updated);
  }

  async executeDelete(id: string): Promise<void> {
    return this.bodyMaterialService.delete(id);
  }
}