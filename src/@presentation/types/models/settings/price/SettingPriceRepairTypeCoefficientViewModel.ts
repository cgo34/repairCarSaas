import { DentRepairTypeViewModel } from "../../carRepair/DentRepairTypeViewModel";

export interface SettingPriceRepairTypeCoefficientViewModel {
  userId: string;
  repairTypeId?: string; // Référence vers RepairType
  coefficient: number; // Multiplicateur de technicité,
  repairTypes: DentRepairTypeViewModel;
}
