import { DentRepairTypeDto } from "@/features/carRepairSettings/application/dtos/DentRepairTypeDto";

export interface IDentRepairTypeRepository {
  getAll(): Promise<DentRepairTypeDto[]>;
  // getById(id: number): Promise<DentRepairType | null>;
  create(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto>;
  update(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto>;
  delete(id: string): Promise<void>;
}