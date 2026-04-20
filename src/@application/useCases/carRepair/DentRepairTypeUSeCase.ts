import { IDentRepairTypeService } from "@/@domain/services/carRepair/IDentRepairTypeService";
import { IDentRepairTypeUseCase } from "@/@domain/useCases/carRepair/IDentRepairTypeUseCase";
import { DentRepairTypeViewModel } from "@/@presentation/types/models/carRepair/DentRepairTypeViewModel";
import { RepairTypeMapper } from "@/@presentation/mappers/settings/RepairTypeMapper";
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

  async executeGetAll(): Promise<DentRepairTypeViewModel[]> {
    const dtos = await this.dentRepairTypeService.getAll();
    return dtos.map(RepairTypeMapper.dtoToView);
  }

  async executeCreate(dentRepairType: DentRepairTypeViewModel): Promise<DentRepairTypeViewModel> {
    const dto = RepairTypeMapper.viewToDto(dentRepairType);
    const created = await this.dentRepairTypeService.create(dto);
    return RepairTypeMapper.dtoToView(created);
  }

  async executeUpdate(dentRepairType: DentRepairTypeViewModel): Promise<DentRepairTypeViewModel> {
    const dto = RepairTypeMapper.viewToDto(dentRepairType);
    const updated = await this.dentRepairTypeService.update(dto);
    return RepairTypeMapper.dtoToView(updated);
  }

  async executeDelete(id: string): Promise<void> {
    return this.dentRepairTypeService.delete(id);
  }
}