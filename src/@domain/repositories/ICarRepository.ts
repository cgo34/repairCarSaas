import { Car } from '@domain/entities/Car';

export interface ICarRepository {
  getAll(): Promise<Car[]>;
  getById(id: string): Promise<Car | null>;
  create(garage: Car): Promise<void>;
  update(garage: Car): Promise<void>;
  delete(id: string): Promise<void>;
}
