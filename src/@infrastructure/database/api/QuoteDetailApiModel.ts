import { BodyMaterialApiModel } from "./carRepair/BodyMaterialApiModel";
import { BodyPartApiModel } from "./carRepair/BodyPartApiModel";
import { DentRepairTypeApiModel } from "./carRepair/DentRepairTypeApiModel";

export interface QuoteDetailApiModel {
  id: string;
  quote_id: string; // Clé étrangère vers la table `quotes`
  body_part_id: string;
  body_parts?: BodyPartApiModel;
  body_material_id: string;
  body_materials?: BodyMaterialApiModel;
  repair_type_id: string;
  repair_types?: DentRepairTypeApiModel
  impact_count_25: number;
  impact_count_35: number;
  stripping_percentage: number;
  price: number;
}
