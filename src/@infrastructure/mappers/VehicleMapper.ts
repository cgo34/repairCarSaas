import { VehicleApiModel } from '@/@infrastructure/database/api/VehicleApiModel';
import { VehicleDto } from '@/@infrastructure/dtos/VehicleDto';

export class VehicleMapper {
  static apiToDto(api: VehicleApiModel): VehicleDto {
    return {
      id: api.id,
      userId: api.user_id,
      garageId: api.garage_id,
      marque: api.marque,
      annee: api.annee ?? undefined,
      immatriculation: api.immatriculation,
      createdAt: api.created_at,
    };
  }

  static dtoToApi(dto: VehicleDto): VehicleApiModel {
    return {
      id: dto.id,
      user_id: dto.userId,
      garage_id: dto.garageId,
      marque: dto.marque,
      annee: dto.annee ?? null,
      immatriculation: dto.immatriculation,
    };
  }
}
