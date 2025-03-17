import { BodyMaterialDto } from "../../carRepair/BodyMaterialDto";

export interface SettingPriceBodyMaterialCoefficientDto {
  userId: string;
  bodyMaterialId?: string;
  coefficient: number;
  bodyMaterials?: BodyMaterialDto;
}
