import { IBodyPartRepository } from "@/features/carRepairSettings/application/ports/repositories/IBodyPartRepository";
import { IBodyPartService } from "@/features/carRepairSettings/application/ports/services/IBodyPartService";
import { BodyPartDto } from "@/features/carRepairSettings/application/dtos/BodyPartDto";

export class BodyPartService implements IBodyPartService {
  constructor(private bodyPartRepository: IBodyPartRepository) {}

  async getAll(): Promise<BodyPartDto[]> {
    return await this.bodyPartRepository.getAll();
  }

  async create(bodyPart: BodyPartDto): Promise<BodyPartDto> {
    return await this.bodyPartRepository.create(bodyPart);
  }

  async update(bodyPart: BodyPartDto): Promise<BodyPartDto> {
    return await this.bodyPartRepository.update(bodyPart);
  }

  async delete(id: string): Promise<void> {
    return await this.bodyPartRepository.delete(id);
  }
}