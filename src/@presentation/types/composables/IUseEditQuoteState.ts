import { ComputedRef, Ref } from 'vue';
import { BodyMaterialViewModel } from '../models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '../models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '../models/carRepair/DentRepairTypeViewModel';
import { CountryViewModel } from '../models/CountryViewModel';
import { DocumentStatuseViewModel } from '../models/DocumentStatuseViewModel';
import { GarageViewModel } from '../models/GarageViewModel';
import { LineItemViewModel } from '../models/LineItemViewModel';
import { UserViewModel } from '../models/UserViewModel';
import { VehicleViewModel } from '../models/VehicleViewModel';

export interface IUseEditQuoteState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(id: string): Promise<void>;
  statuses: ComputedRef<DocumentStatuseViewModel[]>;
  quoteInformations: ComputedRef<{ number: string; date: string, expirationDate: string; status: DocumentStatuseViewModel; }>;
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

  bodyParts: Ref<BodyPartViewModel[]>;
  availableBodyParts: Ref<BodyPartViewModel[]>;
  bodyMaterials: Ref<BodyMaterialViewModel[]>;
  repairTypes: Ref<DentRepairTypeViewModel[]>;

  selectBodyPart(lineId: number, bodyPart: BodyPartViewModel): void;
  selectBodyMaterial(lineId: number, bodyMaterial: BodyMaterialViewModel): void;
  selectRepairType(lineId: number, repairType: DentRepairTypeViewModel): void;

  
  isForfait: ComputedRef<boolean>;
  isDisplayUnitPrice: ComputedRef<boolean>;
  isComputeCommissionWithoutDentRemoval: ComputedRef<boolean>;
  setIsForfait(value: boolean): void;
  setForfaitAmount(value: number): void;
  setIsDisplayUnitPrice(value: boolean): void;
  setIsComputeCommissionWithoutDentRemoval(value: boolean): void;
  forfaitAmount: ComputedRef<number>;
  selectCountry(country: CountryViewModel): void;
  selectedCountry: ComputedRef<CountryViewModel>;

  quoteLines: Ref<LineItemViewModel[]>;
  addLine(): void;
  removeLine(lineId: number): void;

  totalDegarnissage,
  totalCommission: ComputedRef<number>;
  total: ComputedRef<number>;
  save(): Promise<void>;
}
