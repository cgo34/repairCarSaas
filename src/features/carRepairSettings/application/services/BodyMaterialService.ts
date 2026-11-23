import { IBodyMaterialRepository } from "@/features/carRepairSettings/application/ports/repositories/IBodyMaterialRepository";
import { IBodyMaterialService } from "@/features/carRepairSettings/application/ports/services/IBodyMaterialService";
import { BodyMaterialDto } from "@/features/carRepairSettings/application/dtos/BodyMaterialDto";

export class BodyMaterialService implements IBodyMaterialService {
  constructor(private bodyMaterialRepository: IBodyMaterialRepository) {
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