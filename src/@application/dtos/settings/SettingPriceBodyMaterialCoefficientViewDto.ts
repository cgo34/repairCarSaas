import { BodyMaterialViewDto } from "./carRepair/BodyMaterialViewDto";

export interface SettingPriceBodyMaterialCoefficientViewDto {
  userId: string,
  coefficient: number,
  bodyMaterialId?: string,
  bodyMaterials?: BodyMaterialViewDto
}
