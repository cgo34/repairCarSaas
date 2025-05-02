import { BodyMaterialDto } from "./carRepair/BodyMaterialDto";
import { BodyPartDto } from "./carRepair/BodyPartDto";
import { DentRepairTypeDto } from "./carRepair/DentRepairTypeDto";

export interface LineItemDto {
  id: string;
  quoteId: string;
  quoteDetailId: string;
  invoiceId: string;
  bodyPartId: string;
  bodyPart: BodyPartDto
  bodyMaterialId: string;
  bodyMaterial: BodyMaterialDto
  repairTypeId: string;
  repairType: DentRepairTypeDto
  impactCount25: number;
  impactCount35: number;
  dentRemovalPrice: number;
  price: number;
}
