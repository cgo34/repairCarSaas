import { DentRepairTypeApiModel } from "@/features/carRepairSettings/infrastructure/api/DentRepairTypeApiModel";

export interface SettingPriceRepairTypeCoefficientApiModel {
  user_id: string;
  repair_type_id?: string;
  repair_type_coefficient: number;
  repair_types?: DentRepairTypeApiModel;
}
