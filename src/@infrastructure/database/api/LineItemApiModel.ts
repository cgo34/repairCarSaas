import { BodyMaterialApiModel } from "./carRepair/BodyMaterialApiModel";
import { BodyPartApiModel } from "./carRepair/BodyPartApiModel";
import { DentRepairTypeApiModel } from "./carRepair/DentRepairTypeApiModel";

export interface LineItemApiModel {
  id?: string;
  quote_id: string; // Clé étrangère vers la table `quotes`
  quote_detail_id: string; // Clé étrangère vers la table `quotes`
  invoice_id: string; // Clé étrangère vers la table `invoices`
  body_part_id: string;
  bodyPart?: BodyPartApiModel;
  body_material_id: string;
  bodyMaterial?: BodyMaterialApiModel;
  repair_type_id: string;
  repairType?: DentRepairTypeApiModel
  impact_count_25: number;
  impact_count_35: number;
  dent_removal_price: number;
  price: number;
}
