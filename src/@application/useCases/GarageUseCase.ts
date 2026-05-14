import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { GarageDto } from '@/@application/dtos/GarageDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { IGarageRepository } from '@/@domain/repositories/IGarageRepository';

@injectable()
export class GarageUseCase implements IGarageUseCase {
  constructor(
      @inject(SYMBOLS.Repositories.GarageRepository)
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
