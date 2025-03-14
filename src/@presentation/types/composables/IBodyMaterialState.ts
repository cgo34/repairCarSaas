import { BodyMaterialViewModel } from "@/@presentation/types/models/carRepair/BodyMaterialViewModel";
import { ComputedRef, Ref } from "vue";

// TODO: (GCE) -> TO BE MOVED TO PRESENTATION LAYER IN INFRASTRUCTURE FOLDER
export interface IBodyMaterialState {
  bodyMaterials: ComputedRef<BodyMaterialViewModel[]>;
  selectedBodyMaterial: ComputedRef<BodyMaterialViewModel>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  init(): Promise<void>;
  fetchBodyMaterials(): Promise<BodyMaterialViewModel[]>;
  selectBodyMaterial(bodyPart: BodyMaterialViewModel | null): void;
  addBodyMaterial(bodyPart: BodyMaterialViewModel): Promise<BodyMaterialViewModel>;
  updateBodyMaterial(bodyPart: BodyMaterialViewModel): Promise<BodyMaterialViewModel>;
  deleteBodyMaterial(id: string): Promise<void>;
  resetSelectedBodyMaterial(): void;
}