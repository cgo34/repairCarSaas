import { BodyPart } from "@/@domain/entities/carRepair/BodyPart";

export interface IBodyPartUseCase {
  executeGetAll(): Promise<BodyPart[]>;
  executeCreate(bodyPart: BodyPart): Promise<BodyPart>;
  executeUpdate(bodyPart: BodyPart): Promise<BodyPart>;
  executeDelete(id: string): Promise<void>;
}