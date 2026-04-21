import { VehicleDto } from '@/@application/dtos/VehicleDto';
import { VehicleViewModel } from '../types/models/VehicleViewModel';

export class VehicleMapper {
  static dtoToView(dto: VehicleDto): VehicleViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      garageId: dto.garageId,
      marque: dto.marque,
      annee: dto.annee,
      immatriculation: dto.immatriculation,
    };
  }

  static viewToDto(view: VehicleViewModel): VehicleDto {
    return {
      id: view.id,
      userId: view.userId,
      garageId: view.garageId,
      marque: view.marque,
      annee: view.annee,
      immatriculation: view.immatriculation,
    };
  }
}
