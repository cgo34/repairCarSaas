import { IVehicleRepository } from '@/@domain/repositories/IVehicleRepository';
import { IVehicleService } from '@/@domain/services/IVehicleService';
import { VehicleDto } from '@/@application/dtos/VehicleDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class VehicleService implements IVehicleService {
  constructor(
    @inject(SYMBOLS.Repositories.VehicleRepository)
    private readonly vehicleRepository: IVehicleRepository
  ) {}

  async getByGarageId(garageId: string): Promise<VehicleDto[]> {
    return this.vehicleRepository.getByGarageId(garageId);
  }

  async getById(id: string): Promise<VehicleDto | null> {
    return this.vehicleRepository.getById(id);
  }

  async create(vehicle: VehicleDto): Promise<VehicleDto> {
    return this.vehicleRepository.create(vehicle);
  }

  async update(vehicle: VehicleDto): Promise<VehicleDto> {
    return this.vehicleRepository.update(vehicle);
  }

  async delete(id: string): Promise<void> {
    return this.vehicleRepository.delete(id);
  }
}
