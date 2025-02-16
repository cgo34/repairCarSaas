// src/@domain/repositories/carRepair/IBodyPartRepository.ts
import { BodyPart } from '@domain/entities/carRepair/BodyPart';

export interface IBodyPartRepository {
  getAll(): Promise<BodyPart[]>;
  getById(id: number): Promise<BodyPart | null>;
  create(bodyPart: BodyPart): Promise<BodyPart>;
  update(bodyPart: BodyPart): Promise<BodyPart>;
  delete(id: string): Promise<void>;
}