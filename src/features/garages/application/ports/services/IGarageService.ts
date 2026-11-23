import { GarageDto } from '@/features/garages/application/dtos/GarageDto';

export interface IGarageService {
  getGarages(): Promise<GarageDto[]>;
  getByOrganizationId(organizationId: string): Promise<GarageDto[]>;
  create(garage: GarageDto): Promise<GarageDto>;
  update(garage: GarageDto): Promise<GarageDto>;
}
