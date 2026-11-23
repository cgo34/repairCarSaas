import { DentRepairTypeDto } from "@/features/carRepairSettings/application/dtos/DentRepairTypeDto";

export interface IDentRepairTypeService {
  getAll(): Promise<DentRepairTypeDto[]>;
  create(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto>;
  update(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto>;
  delete(id: string): Promise<void>;
}
