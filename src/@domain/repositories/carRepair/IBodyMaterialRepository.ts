// src/@domain/repositories/carRepair/IBodyMaterialRepository.ts
import { BodyMaterialDto } from '@/@application/dtos/carRepair/BodyMaterialDto';

export interface IBodyMaterialRepository {
  getAll(): Promise<BodyMaterialDto[]>;
  create(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto>;
  update(bodyMaterial: BodyMaterialDto): Promise<BodyMaterialDto>;
  delete(id: string): Promise<void>;
}