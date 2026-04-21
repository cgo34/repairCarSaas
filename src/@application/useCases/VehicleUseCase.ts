import { IVehicleService } from '@/@domain/services/IVehicleService';
import { IVehicleUseCase } from '@/@domain/useCases/IVehicleUseCase';
import { VehicleDto } from '@/@application/dtos/VehicleDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class VehicleUseCase implements IVehicleUseCase {
  constructor(
    @inject(SYMBOLS.Services.VehicleService)
    private readonly vehicleService: IVehicleService
  ) {}

  async getByGarageId(garageId: string): Promise<VehicleDto[]> {
    return this.vehicleService.getByGarageId(garageId);
  }

  async getById(id: string): Promise<VehicleDto | null> {
    return this.vehicleService.getById(id);
  }

  async create(vehicle: VehicleDto): Promise<VehicleDto> {
    return this.vehicleService.create(vehicle);
  }

  async update(vehicle: VehicleDto): Promise<VehicleDto> {
    return this.vehicleService.update(vehicle);
  }

  async delete(id: string): Promise<void> {
    return this.vehicleService.delete(id);
  }
}
