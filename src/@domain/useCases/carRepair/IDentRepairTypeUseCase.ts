import { DentRepairTypeDto } from "@/@infrastructure/dtos/carRepair/DentRepairTypeDto";

export interface IDentRepairTypeUseCase {
  executeGetAll(): Promise<DentRepairTypeDto[]>;
  executeCreate(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto>;
  executeUpdate(dentRepairType: DentRepairTypeDto): Promise<DentRepairTypeDto>;
  executeDelete(id: string): Promise<void>;
}