import { DentRepairTypeViewModel } from "@/@presentation/types/models/carRepair/DentRepairTypeViewModel";

export interface IDentRepairTypeUseCase {
  executeGetAll(): Promise<DentRepairTypeViewModel[]>;
  executeCreate(dentRepairType: DentRepairTypeViewModel): Promise<DentRepairTypeViewModel>;
  executeUpdate(dentRepairType: DentRepairTypeViewModel): Promise<DentRepairTypeViewModel>;
  executeDelete(id: string): Promise<void>;
}