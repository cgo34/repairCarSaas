import { GarageDto } from '@/@application/dtos/GarageDto';

export interface IGarageRepository {
  getByOrganizationId(organizationId: string): Promise<GarageDto[]>;
  // getById(id: string): Promise<GarageDto | null>;
  create(garage: GarageDto): Promise<GarageDto>;
  update(garage: GarageDto): Promise<GarageDto>;
  archive(id: string): Promise<GarageDto>;
}
