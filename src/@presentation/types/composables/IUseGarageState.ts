import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { ComputedRef, Ref } from 'vue';

export interface IUseGarageState {
  garages: ComputedRef<GarageViewModel[]>;
  selectedGarage: ComputedRef<GarageViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchGarages(): Promise<GarageViewModel[]>;
  selectGarage(garage: GarageViewModel): void;
  addGarage(garage: GarageViewModel): Promise<GarageViewModel>;
  updateGarage(garage: GarageViewModel): Promise<GarageViewModel>;
  deleteGarage(id: string): Promise<void>;
  resetSelectedGarage(): void;
}
