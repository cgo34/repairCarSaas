import { ComputedRef, Ref } from 'vue';
import { CountryViewModel } from '../models/CountryViewModel';
import { GarageViewModel } from '../models/GarageViewModel';
import { QuoteStatusViewType } from '../models/QuoteStatusViewType';
import { QuoteViewModel } from '../models/QuoteViewModel';
import { UserViewModel } from '../models/UserViewModel';
import { VehicleViewModel } from '../models/VehicleViewModel';

export interface IUseCreateQuoteState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;

  quote: ComputedRef<QuoteViewModel>;
  quoteInformations: ComputedRef<{ number: string; date: string, expirationDate: string; status: QuoteStatusViewType; }>;
  expirationDate: ComputedRef<string>;

  technicians: Ref<UserViewModel[]>;
  garages: Ref<GarageViewModel[]>;
  selectedTechnician: Ref<UserViewModel | undefined>;
  selectedGarage: Ref<GarageViewModel | undefined>;
  selectTechnician(technician: UserViewModel): void;
  selectGarage(garage: GarageViewModel): void;
  setGarage(garage: GarageViewModel): void;
  vehicles: ComputedRef<VehicleViewModel[]>;
  selectedVehicle: ComputedRef<VehicleViewModel | undefined>;
  selectVehicle(vehicle: VehicleViewModel | undefined): void;

  carInformations: ComputedRef<{ immatriculation: string; brand: string; dateEntryCirculation: string; }>;
  setCarImmatriculation(value: string): void;
  setCarBrand(value: string): void;
  setCarDateEntryCirculation(value: string): void;

  isForfait: ComputedRef<boolean>;
  isDisplayUnitPrice: ComputedRef<boolean>;
  isComputeCommissionWithoutDentRemoval: ComputedRef<boolean>;
  setIsForfait(value: boolean): void;
  setForfaitAmount(value: number): void;
  setIsDisplayUnitPrice(value: boolean): void;
  setIsComputeCommissionWithoutDentRemoval(value: boolean): void;
  
  selectCountry(country: CountryViewModel): void;
  selectedCountry: ComputedRef<CountryViewModel>;

  save(): Promise<void>;
}
