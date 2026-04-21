import { IBodyPartService } from "@/@domain/services/carRepair/IBodyPartService";
import { IBodyPartUseCase } from "@/@domain/useCases/carRepair/IBodyPartUseCase";
import { BodyPartDto } from "@/@application/dtos/carRepair/BodyPartDto";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class BodyPartUseCase implements IBodyPartUseCase {
  constructor(
    @inject(SYMBOLS.Services.BodyPartService) private bodyPartService: IBodyPartService
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