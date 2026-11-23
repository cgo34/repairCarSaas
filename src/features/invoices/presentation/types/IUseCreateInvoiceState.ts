import { ComputedRef, Ref } from 'vue';
import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { InvoiceViewModel } from '@/features/invoices/presentation/models/InvoiceViewModel';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
import { VehicleViewModel } from '@/features/vehicles/presentation/models/VehicleViewModel';

export interface IUseCreateInvoiceState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;

  invoice: ComputedRef<InvoiceViewModel | undefined>;
  invoiceInformations: ComputedRef<{ number: string; date: string, expirationDate: string; status_id: string; }>;
  expirationDate: ComputedRef<string>;

  technicians: ComputedRef<OrganizationMemberViewModel[]>;
  garages: Ref<GarageViewModel[]>;
  selectedTechnician: ComputedRef<OrganizationMemberViewModel | undefined>;
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
