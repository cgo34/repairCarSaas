import { BodyMaterialDto } from "@/features/carRepairSettings/application/dtos/BodyMaterialDto";

export interface SettingPriceBodyMaterialCoefficientDto {
  userId: string;
  bodyMaterialId?: string;
  coefficient: number;
  bodyMaterials?: BodyMaterialDto;
}
