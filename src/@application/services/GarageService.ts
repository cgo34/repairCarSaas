import { IGarageRepository } from '@/@domain/repositories/IGarageRepository';
import { IGarageService } from '@/@domain/services/IGarageService';
import { GarageDto } from '@/@application/dtos/GarageDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GarageService implements IGarageService {
  constructor(
    @inject(SYMBOLS.Repositories.GarageRepository)
    private readonly garageRepository: IGarageRepository
  ) {}

  async getGarages(): Promise<GarageDto[]> {
    return await this.garageRepository.getGarages();
  }

  async getByOrganizationId(organizationId: string): Promise<GarageDto[]> {
    return await this.garageRepository.getByOrganizationId(organizationId);
  }

  async getById(id: string): Promise<GarageDto | null> {
    return await this.garageRepository.getById(id);
  }

  async create(garage: GarageDto): Promise<GarageDto> {
    return await this.garageRepository.create(garage);
  }

  async update(garage: GarageDto): Promise<GarageDto> {
    return await this.garageRepository.update(garage);
  }

  async delete(id: string): Promise<void> {
    return await this.garageRepository.delete(id);
  }
}
