import { BodyPartDto } from "../../carRepair/BodyPartDto";

export interface SettingPriceBodyPartCoefficientDto {
  userId: string;
  bodyPartId?: string;
  coefficient: number;
  bodyParts?: BodyPartDto
}
