import { IDentRepairTypeRepository } from "@/features/carRepairSettings/application/ports/repositories/IDentRepairTypeRepository";
import { IDentRepairTypeService } from "@/features/carRepairSettings/application/ports/services/IDentRepairTypeService";
import { DentRepairTypeDto } from "@/features/carRepairSettings/application/dtos/DentRepairTypeDto";

export class DentRepairTypeService implements IDentRepairTypeService {
  constructor(private dentRepairTypeRepository: IDentRepairTypeRepository) {}

  async getAll(): Promise<DentRepairTypeDto[]> {
    return await this.dentRepairTypeRepository.getAll();
  }

  // async getById(id: number): Promise<DentRepairTypeDto | null> {
  //   return await this.dentRepairTypeRepository.getById(id);
  // }

  async create(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    return await this.dentRepairTypeRepository.create(dentRepairType);
  }

  async update(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    return await this.dentRepairTypeRepository.update(dentRepairType);
  }

  async delete(id: string): Promise<void> {
    return await this.dentRepairTypeRepository.delete(id);
  }
}