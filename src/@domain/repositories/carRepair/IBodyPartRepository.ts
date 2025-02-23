// src/@domain/repositories/carRepair/IBodyPartRepository.ts
import { BodyPartDto } from '@/@application/dtos/carRepair/BodyPartDto';

export interface IBodyPartRepository {
  getAll(): Promise<BodyPartDto[]>;
  create(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  update(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  delete(id: string): Promise<void>;
}