import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type {
  PlanChangeDto,
  PlanChangeImpactDto,
  PlanChangeLogDto,
  PlanFeatureDto,
  PlanFeatureValue,
  PlatformPlanDto,
} from '@/features/platformAdmin/application/dtos/PlatformPlanDto';
import type { IListPlatformPlansUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformPlansUseCase';
import type { IPreviewPlanChangesUseCase } from '@/features/platformAdmin/application/useCases/PreviewPlanChangesUseCase';
import type { IApplyPlanChangesUseCase } from '@/features/platformAdmin/application/useCases/ApplyPlanChangesUseCase';
import type { IListPlanChangeLogUseCase } from '@/features/platformAdmin/application/useCases/ListPlanChangeLogUseCase';

export interface IUsePlatformPlans {
  plans: Ref<PlatformPlanDto[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  editMode: Ref<boolean>;
  changes: ComputedRef<PlanChangeDto[]>;
  impacts: Ref<PlanChangeImpactDto[]>;
  isPreviewing: Ref<boolean>;
  isSaving: Ref<boolean>;
  changeLog: Ref<PlanChangeLogDto[]>;
  load(): Promise<void>;
  loadChangeLog(): Promise<void>;
  startEdit(): void;
  cancelEdit(): void;
  valueOf(planId: string, feature: PlanFeatureDto): PlanFeatureValue;
  isChanged(planId: string, feature: PlanFeatureDto): boolean;
  setDraft(planId: string, featureKey: string, value: PlanFeatureValue): void;
  previewChanges(): Promise<boolean>;
  applyChanges(): Promise<boolean>;
}

export interface UsePlatformPlansDependencies {
  listPlatformPlansUseCase: IListPlatformPlansUseCase;
  previewPlanChangesUseCase: IPreviewPlanChangesUseCase;
  applyPlanChangesUseCase: IApplyPlanChangesUseCase;
  listPlanChangeLogUseCase: IListPlanChangeLogUseCase;
}

const toMessage = (e: unknown): string =>
  e instanceof Error ? e.message : String((e as { message?: string })?.message ?? e);

const draftKey = (planId: string, featureKey: string): string => `${planId}:${featureKey}`;

export function createUsePlatformPlans(deps: UsePlatformPlansDependencies): IUsePlatformPlans {
  const plans = ref<PlatformPlanDto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const editMode = ref(false);
  const draft = ref<Record<string, PlanFeatureValue>>({});
  const impacts = ref<PlanChangeImpactDto[]>([]);
  const isPreviewing = ref(false);
  const isSaving = ref(false);
  const changeLog = ref<PlanChangeLogDto[]>([]);

  const valueOf = (planId: string, feature: PlanFeatureDto): PlanFeatureValue => {
    const key = draftKey(planId, feature.key);
    return key in draft.value ? draft.value[key] : feature.value;
  };

  const isChanged = (planId: string, feature: PlanFeatureDto): boolean =>
    draftKey(planId, feature.key) in draft.value;

  const changes = computed<PlanChangeDto[]>(() =>
    plans.value.flatMap(plan =>
      plan.features
        .filter(feature => isChanged(plan.id, feature))
        .map(feature => ({ planId: plan.id, featureKey: feature.key, value: draft.value[draftKey(plan.id, feature.key)] })),
    ),
  );

  const load = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      plans.value = await deps.listPlatformPlansUseCase.execute();
    } catch (e) {
      error.value = toMessage(e);
    } finally {
      isLoading.value = false;
    }
  };

  const loadChangeLog = async (): Promise<void> => {
    try {
      changeLog.value = await deps.listPlanChangeLogUseCase.execute();
    } catch (e) {
      error.value = toMessage(e);
    }
  };

  const startEdit = (): void => {
    editMode.value = true;
  };

  const cancelEdit = (): void => {
    draft.value = {};
    impacts.value = [];
    editMode.value = false;
  };

  // A draft equal to the stored value is dropped so it is not reported as a change
  const setDraft = (planId: string, featureKey: string, value: PlanFeatureValue): void => {
    const key = draftKey(planId, featureKey);
    const original = plans.value.find(p => p.id === planId)?.features.find(f => f.key === featureKey)?.value;
    const next = { ...draft.value };
    if (original === value) delete next[key];
    else next[key] = value;
    draft.value = next;
  };

  const previewChanges = async (): Promise<boolean> => {
    isPreviewing.value = true;
    error.value = null;
    try {
      impacts.value = await deps.previewPlanChangesUseCase.execute(changes.value);
      return true;
    } catch (e) {
      error.value = toMessage(e);
      return false;
    } finally {
      isPreviewing.value = false;
    }
  };

  const applyChanges = async (): Promise<boolean> => {
    isSaving.value = true;
    error.value = null;
    try {
      await deps.applyPlanChangesUseCase.execute(changes.value);
      cancelEdit();
      await Promise.all([load(), loadChangeLog()]);
      return true;
    } catch (e) {
      error.value = toMessage(e);
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    plans, isLoading, error, editMode, changes, impacts, isPreviewing, isSaving, changeLog,
    load, loadChangeLog, startEdit, cancelEdit, valueOf, isChanged, setDraft, previewChanges, applyChanges,
  };
}
