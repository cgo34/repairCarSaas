

import { IBodyPartService } from "@/features/carRepairSettings/application/ports/services/IBodyPartService";
import { BodyPartDto } from "@/features/carRepairSettings/application/dtos/BodyPartDto";

export interface IBodyPartUseCase {
  executeGetAll(): Promise<BodyPartDto[]>;
  executeCreate(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  executeUpdate(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  executeDelete(id: string): Promise<void>;
}

export class BodyPartUseCase implements IBodyPartUseCase {
  constructor(
    private bodyPartService: IBodyPartService
  ) {
    if (!bodyPartService) {
      throw new Error('BodyPartService injection failed in BodyPartUseCase');
    }
  }

  async executeGetAll(): Promise<BodyPartDto[]> {
    return this.bodyPartService.getAll();
  }

  async executeCreate(bodyPart: BodyPartDto): Promise<BodyPartDto> {
    return this.bodyPartService.create(bodyPart);
  }

  async executeUpdate(bodyPart: BodyPartDto): Promise<BodyPartDto> {
    return this.bodyPartService.update(bodyPart);
  }

  async executeDelete(id: string): Promise<void> {
    return this.bodyPartService.delete(id);
  }
}
