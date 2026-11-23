import { IGarageRepository } from '@/features/garages/application/ports/repositories/IGarageRepository';
import { IGarageService } from '@/features/garages/application/ports/services/IGarageService';
import { GarageDto } from '@/features/garages/application/dtos/GarageDto';

export class GarageService implements IGarageService {
  constructor(
    private readonly garageRepository: IGarageRepository
  ) {}

  async getGarages(): Promise<GarageDto[]> {
    return await this.garageRepository.getGarages();
  }

  async getByOrganizationId(organizationId: string): Promise<GarageDto[]> {
    return await this.garageRepository.getByOrganizationId(organizationId);
  }

  async create(garage: GarageDto): Promise<GarageDto> {
    return await this.garageRepository.create(garage);
  }

  async update(garage: GarageDto): Promise<GarageDto> {
    return await this.garageRepository.update(garage);
  }
}
