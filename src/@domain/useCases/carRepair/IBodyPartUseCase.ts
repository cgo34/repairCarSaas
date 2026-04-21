import { BodyPartViewModel } from "@/@presentation/types/models/carRepair/BodyPartViewModel";

export interface IBodyPartUseCase {
  executeGetAll(): Promise<BodyPartViewModel[]>;
  executeCreate(bodyPart: BodyPartViewModel): Promise<BodyPartViewModel>;
  executeUpdate(bodyPart: BodyPartViewModel): Promise<BodyPartViewModel>;
  executeDelete(id: string): Promise<void>;
}