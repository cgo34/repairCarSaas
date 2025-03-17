import { IDentRepairTypeService } from "@/@domain/services/carRepair/IDentRepairTypeService";
import { IDentRepairTypeUseCase } from "@/@domain/useCases/carRepair/IDentRepairTypeUseCase";
import { DentRepairTypeDto } from "@/@infrastructure/dtos/carRepair/DentRepairTypeDto";
import { SYMBOLS } from "@/@infrastructure/ioc/symbols";
import { inject, injectable } from "inversify";

@injectable()
export class DentRepairTypeUseCase implements IDentRepairTypeUseCase {
  constructor(
    @inject(SYMBOLS.Services.DentRepairTypeService) private dentRepairTypeService: IDentRepairTypeService
  ) {
    if (!dentRepairTypeService) {
      throw new Error('DentRepairTypeService injection failed in DentRepairTypeUseCase');
    }
  }

  async executeGetAll(): Promise<DentRepairTypeDto[]> {
    console.log('[DentRepairTypeUseCase] Executing getAll');
    return this.dentRepairTypeService.getAll();
  }

  async executeCreate(DentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    console.log('[DentRepairTypeUseCase] Executing with:', DentRepairType);
    return this.dentRepairTypeService.create(DentRepairType);
  }

  async executeUpdate(DentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    console.log('[DentRepairTypeUseCase] Executing with:', DentRepairType);
    return this.dentRepairTypeService.update(DentRepairType);
  }

  async executeDelete(id: string): Promise<void> {
    console.log('[DentRepairTypeUseCase] Executing with:', id);
    return this.dentRepairTypeService.delete(id);
  }
}