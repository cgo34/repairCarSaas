import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';

export interface IGarageUseCase {
  getGarages(): Promise<GarageViewModel[]>;
  getByUserId(userId: string): Promise<GarageViewModel[]>;
  getById(id: string): Promise<GarageViewModel | null>;
  create(garage: GarageViewModel): Promise<GarageViewModel>;
  update(garage: GarageViewModel): Promise<GarageViewModel>;
  delete(id: string): Promise<void>;
}
