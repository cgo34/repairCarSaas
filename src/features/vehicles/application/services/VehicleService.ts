import { IVehicleRepository } from '@/features/vehicles/application/ports/repositories/IVehicleRepository';
import { IVehicleService } from '@/features/vehicles/application/ports/services/IVehicleService';
import { VehicleDto } from '@/features/vehicles/application/dtos/VehicleDto';

export class VehicleService implements IVehicleService {
  constructor(
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
