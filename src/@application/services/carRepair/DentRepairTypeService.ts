import { IDentRepairTypeRepository } from "@/@domain/repositories/carRepair/IDentRepairTypeRepository";
import { IDentRepairTypeService } from "@/@domain/services/carRepair/IDentRepairTypeService";
import { DentRepairTypeDto } from "@/@infrastructure/dtos/carRepair/DentRepairTypeDto";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class DentRepairTypeService implements IDentRepairTypeService {
  constructor(@inject(SYMBOLS.Repositories.DentRepairTypeRepository) private dentRepairTypeRepository: IDentRepairTypeRepository) {
    console.log('[DentRepairTypeService] Initialized with DentRepairTypeRepository:', dentRepairTypeRepository);
  }

  async getAll(): Promise<DentRepairTypeDto[]> {
    return await this.dentRepairTypeRepository.getAll();
  }

  // async getById(id: number): Promise<DentRepairTypeDto | null> {
  //   return await this.dentRepairTypeRepository.getById(id);
  // }

  async create(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    console.log('[DentRepairTypeService.create] dentRepairType:', dentRepairType);
    
    return await this.dentRepairTypeRepository.create(dentRepairType);
  }

  async update(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    return await this.dentRepairTypeRepository.update(dentRepairType);
  }

  async delete(id: string): Promise<void> {
    return await this.dentRepairTypeRepository.delete(id);
  }
}