import { BodyMaterialViewModel } from "./carRepair/BodyMaterialViewModel";
import { BodyPartViewModel } from "./carRepair/BodyPartViewModel";
import { DentRepairTypeViewModel } from "./carRepair/DentRepairTypeViewModel";

type LineItemType = 'quote' | 'invoice';

export interface LineItemViewModel {
  id: number;
  bodyPart?: BodyPartViewModel;
  impactCount25?: number;
  impactCount35?: number;
  bodyMaterial?: BodyMaterialViewModel;
  repairType?: DentRepairTypeViewModel;
  strippingPercentage?: number;
  lineItemType: LineItemType;
};
