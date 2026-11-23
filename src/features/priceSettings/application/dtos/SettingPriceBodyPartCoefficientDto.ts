import { BodyPartDto } from "@/features/carRepairSettings/application/dtos/BodyPartDto";

export interface SettingPriceBodyPartCoefficientDto {
  userId: string;
  bodyPartId?: string;
  coefficient: number;
  bodyParts?: BodyPartDto
}
