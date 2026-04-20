import { VehicleDto } from '@/@infrastructure/dtos/VehicleDto';

export interface IVehicleService {
  getByGarageId(garageId: string): Promise<VehicleDto[]>;
  getById(id: string): Promise<VehicleDto | null>;
  create(vehicle: VehicleDto): Promise<VehicleDto>;
  update(vehicle: VehicleDto): Promise<VehicleDto>;
  delete(id: string): Promise<void>;
}
