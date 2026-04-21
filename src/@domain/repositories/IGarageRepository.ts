import { GarageDto } from '@/@application/dtos/GarageDto';

export interface IGarageRepository {
  getByUserId(userId: string): Promise<GarageDto[]>;
  getById(id: string): Promise<GarageDto | null>;
  create(garage: GarageDto): Promise<GarageDto>;
  update(garage: GarageDto): Promise<GarageDto>;
  delete(id: string): Promise<void>;
}
