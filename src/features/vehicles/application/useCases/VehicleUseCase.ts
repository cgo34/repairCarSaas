import { IVehicleService } from '@/features/vehicles/application/ports/services/IVehicleService';
import { VehicleDto } from '@/features/vehicles/application/dtos/VehicleDto';

export interface IVehicleUseCase {
  getByGarageId(garageId: string): Promise<VehicleDto[]>;
  getById(id: string): Promise<VehicleDto | null>;
  create(vehicle: VehicleDto): Promise<VehicleDto>;
  update(vehicle: VehicleDto): Promise<VehicleDto>;
  delete(id: string): Promise<void>;
}

export class VehicleUseCase implements IVehicleUseCase {
  constructor(
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
