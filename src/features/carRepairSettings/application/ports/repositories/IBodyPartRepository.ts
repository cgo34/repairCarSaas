// src/@domain/repositories/carRepair/IBodyPartRepository.ts
import { BodyPartDto } from '@/features/carRepairSettings/application/dtos/BodyPartDto';

export interface IBodyPartRepository {
  getAll(): Promise<BodyPartDto[]>;
  create(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  update(bodyPart: BodyPartDto): Promise<BodyPartDto>;
  delete(id: string): Promise<void>;
}