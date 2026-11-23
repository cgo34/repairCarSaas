import { BodyMaterialApiModel } from "@/features/carRepairSettings/infrastructure/api/BodyMaterialApiModel";
import { BodyPartApiModel } from "@/features/carRepairSettings/infrastructure/api/BodyPartApiModel";
import { DentRepairTypeApiModel } from "@/features/carRepairSettings/infrastructure/api/DentRepairTypeApiModel";

export interface InvoiceDetailApiModel {
  id: string;
  invoice_id: string; // Clé étrangère vers la table `invoice`
  quote_id: string; // Clé étrangère vers la table `quotes`
  body_part_id: string;
  body_parts?: BodyPartApiModel;
  body_material_id: string;
  body_materials?: BodyMaterialApiModel;
  repair_type_id: string;
  repair_types?: DentRepairTypeApiModel
  impact_count_25: number;
  impact_count_35: number;
  dent_removal_price: number;
  price: number;
}
