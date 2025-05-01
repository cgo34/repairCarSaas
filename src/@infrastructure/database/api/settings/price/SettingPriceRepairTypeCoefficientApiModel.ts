import { DentRepairTypeApiModel } from "../../carRepair/DentRepairTypeApiModel";

export interface SettingPriceRepairTypeCoefficientApiModel {
  user_id: string;
  repair_type_id?: string;
  repair_type_coefficient: number;
  repair_types?: DentRepairTypeApiModel;
}
