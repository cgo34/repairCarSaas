import { BodyPartDto } from "@/@infrastructure/dtos/carRepair/BodyPartDto";

export interface IBodyPartUseCase {
  executeGetAll(): Promise<BodyPartDto[]>;
  executeCreate(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  executeUpdate(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  executeDelete(id: string): Promise<void>;
}