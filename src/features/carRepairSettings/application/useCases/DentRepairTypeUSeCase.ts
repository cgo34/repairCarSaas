

import { IDentRepairTypeService } from "@/features/carRepairSettings/application/ports/services/IDentRepairTypeService";
import { DentRepairTypeDto } from "@/features/carRepairSettings/application/dtos/DentRepairTypeDto";

export interface IDentRepairTypeUseCase {
  executeGetAll(): Promise<DentRepairTypeDto[]>;
  executeCreate(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto>;
  executeUpdate(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto>;
  executeDelete(id: string): Promise<void>;
}

export class DentRepairTypeUseCase implements IDentRepairTypeUseCase {
  constructor(
    private dentRepairTypeService: IDentRepairTypeService
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
