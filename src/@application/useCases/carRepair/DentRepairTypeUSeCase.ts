import { IDentRepairTypeService } from "@/@domain/services/carRepair/IDentRepairTypeService";
import { IDentRepairTypeUseCase } from "@/@domain/useCases/carRepair/IDentRepairTypeUseCase";
import { DentRepairTypeDto } from "@/@application/dtos/carRepair/DentRepairTypeDto";
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
    return this.dentRepairTypeService.getAll();
  }

  async executeCreate(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    return this.dentRepairTypeService.create(dentRepairType);
  }

  async executeUpdate(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto> {
    return this.dentRepairTypeService.update(dentRepairType);
  }

  async executeDelete(id: string): Promise<void> {
    return this.dentRepairTypeService.delete(id);
  }
}