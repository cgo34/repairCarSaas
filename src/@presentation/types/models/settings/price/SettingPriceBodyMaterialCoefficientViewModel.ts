export interface SettingPriceBodyMaterialCoefficientViewModel {
  id: string;
  userId: string;
  bodyMaterialId: string; // Référence vers BodyMaterial
  coefficient: number; // Multiplicateur de technicité
}
