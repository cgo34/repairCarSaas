import { BodyPartApiModel } from "../../carRepair/BodyPartApiModel";

export interface SettingPriceBodyPartCoefficientApiModel {
  organization_id: string;
  body_part_id?: string;
  difficulty_coefficient: number;
  body_parts?: BodyPartApiModel;
}
