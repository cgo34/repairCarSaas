import { BodyPartViewModel } from "../../carRepair/BodyPartViewModel";

export interface SettingPriceBodyPartCoefficientViewModel {
  userId: string;
  bodyPartId: string;
  coefficient: number;
  bodyParts: BodyPartViewModel;
}
