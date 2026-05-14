import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { GarageForm } from '@/@presentation/types/forms/GarageForm';
import { ComputedRef, Ref } from 'vue';

export interface IUseGarageState {
  garages: ComputedRef<GarageViewModel[]>;
  selectedGarageForm: ComputedRef<GarageForm>;
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  fetchGarages(): Promise<GarageViewModel[]>;
  selectGarage(garage: GarageViewModel): void;
  addGarage(garage: GarageViewModel): Promise<void>;
  updateGarage(garage: GarageViewModel): Promise<void>;
  archiveGarage(id: string): Promise<void>;
  resetSelectedGarageForm(): void;
}
