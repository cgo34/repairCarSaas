import { BodyMaterialViewModel } from "@/features/carRepairSettings/presentation/models/BodyMaterialViewModel";

export interface SettingPriceBodyMaterialCoefficientViewModel {
  userId: string;
  bodyMaterialId?: string; // Référence vers BodyMaterial
  coefficient: number; // Multiplicateur de technicité,
  bodyMaterials: BodyMaterialViewModel;
}
