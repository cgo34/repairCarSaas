import { BodyPartViewModel } from "../../carRepair/BodyPartViewModel";

export interface SettingPriceBodyPartCoefficientViewModel {
  userId: string;
  bodyPartId?: string; // Référence vers BodyPart
  coefficient: number; // Multiplicateur de difficulté
  bodyParts: BodyPartViewModel;
}
