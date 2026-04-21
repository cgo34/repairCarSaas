import { IBodyMaterialRepository } from "@/@domain/repositories/carRepair/IBodyMaterialRepository";
import { IBodyMaterialService } from "@/@domain/services/carRepair/IBodyMaterialService";
import { BodyMaterialDto } from "@/@application/dtos/carRepair/BodyMaterialDto";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class BodyMaterialService implements IBodyMaterialService {
  constructor(@inject(SYMBOLS.Repositories.BodyMaterialRepository) private bodyMaterialRepository: IBodyMaterialRepository) {
  }

  async getAll(): Promise<BodyMaterialDto[]> {
    return await this.bodyMaterialRepository.getAll();
  }

  async create(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto> {
    return await this.bodyMaterialRepository.create(bodyMaterial);
  }

  async update(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto> {
    return await this.bodyMaterialRepository.update(bodyMaterial);
  }

  async delete(id: string): Promise<void> {
    return await this.bodyMaterialRepository.delete(id);
  }
}