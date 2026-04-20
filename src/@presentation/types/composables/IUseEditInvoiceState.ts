import { ComputedRef, Ref } from 'vue';
import { BodyMaterialViewModel } from '../models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '../models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '../models/carRepair/DentRepairTypeViewModel';
import { CountryViewModel } from '../models/CountryViewModel';
import { GarageViewModel } from '../models/GarageViewModel';
import { InvoiceStatusViewType } from '../models/InvoiceStatusViewType';
import { LineItemViewModel } from '../models/LineItemViewModel';
import { UserViewModel } from '../models/UserViewModel';

export interface IUseEditInvoiceState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(id: string): Promise<void>;
  quoteInformations: ComputedRef<{ number: string; date: string, expirationDate: string; status: InvoiceStatusViewType; }>;
  expirationDate: ComputedRef<string>;

  technicians: Ref<UserViewModel[]>;
  garages: Ref<GarageViewModel[]>;
  selectedTechnician: Ref<UserViewModel | undefined>;
  selectedGarage: Ref<GarageViewModel | undefined>;
  selectTechnician(technician: UserViewModel): void;
  selectGarage(garage: GarageViewModel): void;

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
  total: ComputedRef<number>,
  save(): Promise<void>;
  sendInvoice(): Promise<void>;
}
