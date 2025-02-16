import { BodyPart } from "@/@domain/entities/carRepair/BodyPart";
import { ComputedRef, Ref } from "vue";

export interface IBodyPartState {
  bodyParts: ComputedRef<BodyPart[]>;
  selectedBodyPart: ComputedRef<BodyPart>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(): Promise<void>;
  fetchBodyParts(): Promise<BodyPart[]>;
  selectBodyPart(bodyPart: BodyPart | null): void;
  addBodyPart(bodyPart: BodyPart): Promise<BodyPart>;
  updateBodyPart(bodyPart: BodyPart): Promise<BodyPart>;
  deleteBodyPart(id: string): Promise<void>;
}