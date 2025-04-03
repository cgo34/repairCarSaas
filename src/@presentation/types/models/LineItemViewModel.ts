import { BodyMaterialViewModel } from "./carRepair/BodyMaterialViewModel";
import { BodyPartViewModel } from "./carRepair/BodyPartViewModel";
import { DentRepairTypeViewModel } from "./carRepair/DentRepairTypeViewModel";

type LineItemType = 'quote' | 'invoice';

export interface LineItemViewModel {
  id?: string;
  lineId?: number;
  quoteId?: string;
  bodyPartId?: string;
  bodyPart?: BodyPartViewModel;
  impactCount25?: number;
  impactCount35?: number;
  bodyMaterialId?: string;
  bodyMaterial?: BodyMaterialViewModel;
  repairTypeId?: string;
  repairType?: DentRepairTypeViewModel;
  dentRemovalPrice?: number;
  lineItemType: LineItemType;
  price: number;
};
