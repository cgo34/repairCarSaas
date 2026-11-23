import { BodyPartViewModel } from "@/features/carRepairSettings/presentation/models/BodyPartViewModel";

export interface SettingPriceBodyPartCoefficientViewModel {
  userId: string;
  bodyPartId: string;
  coefficient: number;
  bodyParts: BodyPartViewModel;
}
