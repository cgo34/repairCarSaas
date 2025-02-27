import { DentRepairTypeViewModel } from "@/@presentation/types/models/carRepair/DentRepairTypeViewModel";
import { ComputedRef, Ref } from "vue";

export interface IDentRepairTypeState {
  dentRepairTypes: ComputedRef<DentRepairTypeViewModel[]>;
  selectedDentRepairType: ComputedRef<DentRepairTypeViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(): Promise<void>;
  fetchDentRepairTypes(): Promise<DentRepairTypeViewModel[]>;
  selectDentRepairType(dentRepairType: DentRepairTypeViewModel | null): void;
  addDentRepairType(dentRepairType: DentRepairTypeViewModel): Promise<DentRepairTypeViewModel>;
  updateDentRepairType(dentRepairType: DentRepairTypeViewModel): Promise<DentRepairTypeViewModel>;
  deleteDentRepairType(id: string): Promise<void>;
  resetSelectedDentRepairType(): void;
}