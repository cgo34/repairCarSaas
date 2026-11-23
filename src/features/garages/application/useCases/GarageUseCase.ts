import { GarageDto } from '@/features/garages/application/dtos/GarageDto';
import { IGarageRepository } from '@/features/garages/application/ports/repositories/IGarageRepository';

export interface IGarageUseCase {
  getGaragesByOrganizationId(organizationId: string): Promise<GarageDto[]>;
  // getById(id: string): Promise<GarageDto | null>;
  create(garage: GarageDto): Promise<GarageDto>;
  update(garage: GarageDto): Promise<GarageDto>;
  archive(id: string): Promise<GarageDto>;
}

export class GarageUseCase implements IGarageUseCase {
  constructor(
      private readonly garageRepository: IGarageRepository
  ) {}

  async getGaragesByOrganizationId(organizationId: string): Promise<GarageDto[]> {
    return this.garageRepository.getByOrganizationId(organizationId);
  }

  // async getById(id: string): Promise<GarageDto | null> {
  //   return this.garageRepository.getById(id);
  // }

  async create(garage: GarageDto): Promise<GarageDto> {
    return this.garageRepository.create(garage);
  }

  async update(garage: GarageDto): Promise<GarageDto> {
    return this.garageRepository.update(garage);
  }

  async archive(id: string): Promise<GarageDto> {
    return this.garageRepository.archive(id);
  }
}
