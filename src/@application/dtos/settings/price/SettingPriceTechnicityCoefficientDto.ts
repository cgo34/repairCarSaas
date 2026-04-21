export interface SettingPriceTechnicityCoefficientDto {
  id?: string; // UUID
  userId: string;
  diameter25Coefficient: number;
  diameter35Coefficient: number;
  aluminiumCoefficient: number;
  dapCoefficient: number;
  dspCoefficient: number;
}
