import { BodyMaterialDto } from "@/@application/dtos/carRepair/BodyMaterialDto";

export interface IBodyMaterialUseCase {
  executeGetAll(): Promise<BodyMaterialDto[]>;
  executeCreate(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto>;
  executeUpdate(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto>;
  executeDelete(id: string): Promise<void>;
}