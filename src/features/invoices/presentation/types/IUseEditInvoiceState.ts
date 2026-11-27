import { ComputedRef, Ref } from 'vue';
import { BodyMaterialViewModel } from '@/features/carRepairSettings/presentation/models/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/features/carRepairSettings/presentation/models/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/features/carRepairSettings/presentation/models/DentRepairTypeViewModel';
import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { InvoiceStatusViewType } from '@/features/invoices/presentation/models/InvoiceStatusViewType';
import { LineItemViewModel } from '@/features/lineItems/presentation/models/LineItemViewModel';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';
import { InvoiceViewModel } from '@/features/invoices/presentation/models/InvoiceViewModel';
import { VehicleViewModel } from '@/features/vehicles/presentation/models/VehicleViewModel';

export interface IUseEditInvoiceState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(id: string): Promise<void>;
  invoice: ComputedRef<InvoiceViewModel | undefined>;
  invoiceInformations: ComputedRef<{ number: string; quoteNumber: string; date: string, expirationDate: string; status: InvoiceStatusViewType; }>;
  expirationDate: ComputedRef<string>;

  technicians: ComputedRef<OrganizationMemberViewModel[]>;
  garages: Ref<GarageViewModel[]>;
  selectedTechnician: ComputedRef<OrganizationMemberViewModel | undefined>;
  selectedGarage: ComputedRef<GarageViewModel | undefined>;
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
  forfaitAmount: ComputedRef<number | undefined>;
  selectCountry(country: CountryViewModel): void;
  selectedCountry: ComputedRef<CountryViewModel | undefined>;

  invoiceLines: ComputedRef<LineItemViewModel[]>;
  addLine(line: LineItemViewModel): Promise<void>;
  updateLine(line: LineItemViewModel): Promise<void>;
  removeLine(lineId: string | undefined): Promise<void>;

  subtotal: ComputedRef<number>;
  subTotalWithDegarnissage: ComputedRef<number>;
  totalTaxRate: ComputedRef<number>;
  totalDegarnissage: ComputedRef<number>;
  totalCommission: ComputedRef<number>;
  total: ComputedRef<number>;
  invoiceStatus: ComputedRef<InvoiceStatusViewType>;
  isReadOnly: ComputedRef<boolean>;
  canDelete: ComputedRef<boolean>;
  isSent: ComputedRef<boolean>;
  sentAt: ComputedRef<Date | undefined>;
  hasItems: ComputedRef<boolean>;
  updateInvoice(): Promise<void>;
  updateInvoiceStatus(status: InvoiceStatusViewType): Promise<void>;
  deleteInvoice(): void;
  sendInvoice(): Promise<void>;
  finalizeInvoice(): Promise<void>;
}
