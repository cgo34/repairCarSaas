import { BodyMaterialViewModel } from "../../carRepair/BodyMaterialViewModel";

export interface SettingPriceBodyMaterialCoefficientViewModel {
  userId: string;
  bodyMaterialId?: string; // Référence vers BodyMaterial
  coefficient: number; // Multiplicateur de technicité,
  bodyMaterials: BodyMaterialViewModel;
}
