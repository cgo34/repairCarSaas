

import { IBodyMaterialService } from "@/features/carRepairSettings/application/ports/services/IBodyMaterialService";
import { BodyMaterialDto } from "@/features/carRepairSettings/application/dtos/BodyMaterialDto";

export interface IBodyMaterialUseCase {
  executeGetAll(): Promise<BodyMaterialDto[]>;
  executeCreate(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto>;
  executeUpdate(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto>;
  executeDelete(id: string): Promise<void>;
}

export class BodyMaterialUseCase implements IBodyMaterialUseCase {
  constructor(
    private bodyMaterialService: IBodyMaterialService
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
