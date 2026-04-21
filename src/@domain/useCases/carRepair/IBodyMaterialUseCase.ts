import { BodyMaterialViewModel } from "@/@presentation/types/models/carRepair/BodyMaterialViewModel";

export interface IBodyMaterialUseCase {
  executeGetAll(): Promise<BodyMaterialViewModel[]>;
  executeCreate(bodyMaterial: BodyMaterialViewModel): Promise<BodyMaterialViewModel>;
  executeUpdate(bodyMaterial: BodyMaterialViewModel): Promise<BodyMaterialViewModel>;
  executeDelete(id: string): Promise<void>;
}