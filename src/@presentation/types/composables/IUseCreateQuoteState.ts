import { Ref } from 'vue';
import { BodyMaterialViewModel } from '../models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '../models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '../models/carRepair/DentRepairTypeViewModel';
import { GarageViewModel } from '../models/GarageViewModel';
import { LineItemViewModel } from '../models/LineItemViewModel';
import { UserViewModel } from '../models/UserViewModel';

export interface IUseCreateQuoteState {
  loading: Ref<boolean>;
  error: Ref<unknown>;

  init(): Promise<void>;
  technicians: Ref<UserViewModel[]>;
  garages: Ref<GarageViewModel[]>;
  selectedTechnician: Ref<UserViewModel | undefined>;
  selectedGarage: Ref<GarageViewModel | undefined>;
  selectTechnician(technician: UserViewModel): void;
  selectGarage(garage: GarageViewModel): void;
  bodyParts: Ref<BodyPartViewModel[]>;
  availableBodyParts: Ref<BodyPartViewModel[]>;
  bodyMaterials: Ref<BodyMaterialViewModel[]>;
  repairTypes: Ref<DentRepairTypeViewModel[]>;

  quoteLines: Ref<LineItemViewModel[]>;
  addLine(): void;
}
