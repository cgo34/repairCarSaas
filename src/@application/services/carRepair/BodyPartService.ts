import { IBodyPartRepository } from "@/@domain/repositories/carRepair/IBodyPartRepository";
import { IBodyPartService } from "@/@domain/services/carRepair/IBodyPartService";
import { BodyPartDto } from "@/@infrastructure/dtos/carRepair/BodyPartDto";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class BodyPartService implements IBodyPartService {
  constructor(@inject(SYMBOLS.Repositories.BodyPartRepository) private bodyPartRepository: IBodyPartRepository) {
    console.log('[BodyPartService] Initialized with BodyPartRepository:', bodyPartRepository);
  }

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