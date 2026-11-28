import { ComputedRef, Ref } from 'vue';
import { QuoteViewModel } from '@/features/quotes/presentation/models/QuoteViewModel';
import { BodyMaterialViewModel } from '@/features/carRepairSettings/presentation/models/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/features/carRepairSettings/presentation/models/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/features/carRepairSettings/presentation/models/DentRepairTypeViewModel';
import { CountryViewModel } from '@/features/countries/presentation/models/CountryViewModel';
import { DocumentStatusViewModel } from '@/features/documentStatuses/presentation/models/DocumentStatusViewModel';
import { GarageViewModel } from '@/features/garages/presentation/models/GarageViewModel';
import { LineItemViewModel } from '@/features/lineItems/presentation/models/LineItemViewModel';
import { OrganizationMemberViewModel } from '@/features/organizations/presentation/models/OrganizationMemberViewmodel';

export interface IUseEditQuoteState {
  loading: Ref<boolean>;
  error: Ref<unknown>;
  isReadOnly: ComputedRef<boolean>;
  isAccepted: ComputedRef<boolean>;
  isSent: ComputedRef<boolean>;
  sentAt: ComputedRef<Date | undefined>;
  hasItems: ComputedRef<boolean>;
  canSend: ComputedRef<boolean>;
  canDecide: ComputedRef<boolean>;
  canDelete: ComputedRef<boolean>;
  sendQuote(): Promise<void>;
  finalizeQuote(): Promise<void>;
  isRefused: ComputedRef<boolean>;

  init(id: string): Promise<void>;
  quote: ComputedRef<QuoteViewModel | undefined>;
  quoteInformations: ComputedRef<{ number: string; date: string, expirationDate: string; status: DocumentStatusViewModel | undefined; isSent: boolean; }>;
  expirationDate: ComputedRef<string>;

  technicians: Ref<OrganizationMemberViewModel[]>;
  garages: Ref<GarageViewModel[]>;
  selectedTechnician: Ref<OrganizationMemberViewModel | undefined>;
  selectedGarage: Ref<GarageViewModel | undefined>;
  selectTechnician(technician: OrganizationMemberViewModel): void;
  selectGarage(garage: GarageViewModel): void;
  setGarage(garage: GarageViewModel): void;

  carInformations: ComputedRef<{ immatriculation: string; brand: string; carYear: string; }>;
  setCarImmatriculation(value: string): void;
  setCarBrand(value: string): void;
  setCarYear(value: string): void;

  bodyParts: Ref<BodyPartViewModel[]>;
  availableBodyParts: Ref<BodyPartViewModel[]>;
  bodyMaterials: Ref<BodyMaterialViewModel[]>;
  repairTypes: Ref<DentRepairTypeViewModel[]>;

  // selectBodyPart(lineId: number, bodyPart: BodyPartViewModel): void;
  // selectBodyMaterial(lineId: number, bodyMaterial: BodyMaterialViewModel): void;
  // selectRepairType(lineId: number, repairType: DentRepairTypeViewModel): void;

  
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

  quoteLines: Ref<LineItemViewModel[]>;
  addLine(line: LineItemViewModel): Promise<void>;
  updateLine(line: LineItemViewModel): Promise<void>;
  removeLine(lineId: string | undefined): Promise<void>;

  subtotal: ComputedRef<number>;
  subTotalWithDegarnissage: ComputedRef<number>;
  totalTaxRate: ComputedRef<number>;
  totalDegarnissage: ComputedRef<number>;
  totalCommission: ComputedRef<number>;
  total: ComputedRef<number>;

  updateQuote(): Promise<void>;
  deleteQuote(): Promise<void>;
  duplicateQuoteToInvoice(): Promise<string | undefined>;
  updateQuoteStatus(status: Pick<DocumentStatusViewModel, 'code'>): Promise<void>;
}
