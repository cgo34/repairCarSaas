import { IBodyMaterialService } from "@/@domain/services/carRepair/IBodyMaterialService";
import { IBodyMaterialUseCase } from "@/@domain/useCases/carRepair/IBodyMaterialUseCase";
import { BodyMaterialDto } from "@/@infrastructure/dtos/carRepair/BodyMaterialDto";
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

  async executeGetAll(): Promise<BodyMaterialDto[]> {
    return this.bodyMaterialService.getAll();
  }

  async executeCreate(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto> {
    return this.bodyMaterialService.create(bodyMaterial);
  }

  async executeUpdate(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto> {
    return this.bodyMaterialService.update(bodyMaterial);
  }

  async executeDelete(id: string): Promise<void> {
    return this.bodyMaterialService.delete(id);
  }
}