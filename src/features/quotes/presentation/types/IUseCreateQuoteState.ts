import { ComputedRef, Ref } from 'vue';
import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { QuoteViewModel } from '@/features/quotes/presentation/models/QuoteViewModel';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
import { VehicleViewModel } from '@/features/vehicles/presentation/models/VehicleViewModel';

export interface IUseCreateQuoteState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;

  quote: ComputedRef<QuoteViewModel | undefined>;
  quoteInformations: ComputedRef<{ number: string; date: string, expirationDate: string; status_id: string; }>;
  expirationDate: ComputedRef<string>;

  technicians: Ref<OrganizationMemberViewModel[]>;
  garages: Ref<GarageViewModel[]>;
  selectedTechnician: Ref<OrganizationMemberViewModel | undefined>;
  selectedGarage: Ref<GarageViewModel | undefined>;
  selectTechnician(technician: OrganizationMemberViewModel): void;
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
  forfaitAmount: ComputedRef<number | undefined>;
  isDisplayUnitPrice: ComputedRef<boolean>;
  isComputeCommissionWithoutDentRemoval: ComputedRef<boolean>;
  setIsForfait(value: boolean): void;
  setForfaitAmount(value: number): void;
  setIsDisplayUnitPrice(value: boolean): void;
  setIsComputeCommissionWithoutDentRemoval(value: boolean): void;
  
  selectCountry(country: CountryViewModel): void;
  selectedCountry: ComputedRef<CountryViewModel | undefined>;

  save(): Promise<void>;
}
