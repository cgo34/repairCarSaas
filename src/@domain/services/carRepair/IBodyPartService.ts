import { BodyPart } from "@domain/entities/carRepair/BodyPart";

export interface IBodyPartService {
  getAll(): Promise<BodyPart[]>;
  create(bodyPart: BodyPart): Promise<BodyPart>;
  update(bodyPart: BodyPart): Promise<BodyPart>;
  delete(id: string): Promise<void>;
}