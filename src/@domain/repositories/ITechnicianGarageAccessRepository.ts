import { GarageDto } from '@/@application/dtos/GarageDto';

export interface ITechnicianGarageAccessRepository {
  getGaragesByTechnicianId(technicianId: string): Promise<GarageDto[]>;
  assignGarage(technicianId: string, garageId: string): Promise<void>;
  removeGarage(technicianId: string, garageId: string): Promise<void>;
}
