import { BodyMaterialDto } from "@/@infrastructure/dtos/carRepair/BodyMaterialDto";

export interface IBodyMaterialService {
  getAll(): Promise<BodyMaterialDto[]>;
  create(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto>;
  update(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto>;
  delete(id: string): Promise<void>;
}