import { Garage } from '@/@domain/entities/Garage';

export interface IGarageRepository {
  getAll(): Promise<Garage[]>;
  getById(id: string): Promise<Garage | null>;
  create(garage: Garage): Promise<void>;
  update(garage: Garage): Promise<void>;
  delete(id: string): Promise<void>;
}
