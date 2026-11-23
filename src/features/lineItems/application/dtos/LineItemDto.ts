import { BodyMaterialDto } from "@/features/carRepairSettings/application/dtos/BodyMaterialDto";
import { BodyPartDto } from "@/features/carRepairSettings/application/dtos/BodyPartDto";
import { DentRepairTypeDto } from "@/features/carRepairSettings/application/dtos/DentRepairTypeDto";

export interface LineItemDto {
  id?: string;
  invoiceId?: string;
  quoteId?: string;
  quoteDetailId?: string;
  bodyPartId: string;
  bodyPart?: BodyPartDto
  bodyMaterialId: string;
  bodyMaterial?: BodyMaterialDto
  repairTypeId: string;
  repairType?: DentRepairTypeDto
  impactCount25: number;
  impactCount35: number;
  dentRemovalPrice: number;
  price: number;
}
