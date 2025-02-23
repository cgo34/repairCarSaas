export interface SettingPriceBodyPartCoefficientViewModel {
  id: string;
  userId: string;
  bodyPartId: string; // Référence vers BodyPart
  coefficient: number; // Multiplicateur de difficulté
}
