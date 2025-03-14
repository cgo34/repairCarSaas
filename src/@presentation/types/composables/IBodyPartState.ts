import { BodyPartViewModel } from "@/@presentation/types/models/carRepair/BodyPartViewModel";
import { ComputedRef, Ref } from "vue";

export interface IBodyPartState {
  bodyParts: ComputedRef<BodyPartViewModel[]>;
  selectedBodyPart: ComputedRef<BodyPartViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(): Promise<void>;
  fetchBodyParts(): Promise<BodyPartViewModel[]>;
  selectBodyPart(bodyPart: BodyPartViewModel): void;
  addBodyPart(bodyPart: BodyPartViewModel): Promise<BodyPartViewModel>;
  updateBodyPart(bodyPart: BodyPartViewModel): Promise<BodyPartViewModel>;
  deleteBodyPart(id: string): Promise<void>;
  resetSelectedBodyPart(): void;
}