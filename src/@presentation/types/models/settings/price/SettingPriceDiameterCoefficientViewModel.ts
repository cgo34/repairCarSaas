export interface SettingPriceDiameterCoefficientViewModel {
  id?: string;
  userId: string;
  diameter: number; // Diamètre en mm (ex: 25, 35)
  coefficient: number; // Multiplicateur selon le diamètre
}
