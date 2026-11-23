import { BodyMaterialApiModel } from "@/features/carRepairSettings/infrastructure/api/BodyMaterialApiModel";

export interface SettingPriceBodyMaterialCoefficientApiModel {
  user_id: string;
  body_material_id?: string;
  material_coefficient: number;
  body_materials?: BodyMaterialApiModel;
}
