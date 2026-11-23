import { computed, ComputedRef, ref } from 'vue';

export interface PriceTabHandle {
  isDirty: boolean;
  save(): Promise<void>;
  reset(): Promise<void>;
}

export function usePriceTabForm(
  settings: ComputedRef<unknown>,
  init: () => Promise<void>,
  persist: () => Promise<void>
) {
  const snapshot = ref<string | null>(null);

  const takeSnapshot = () => {
    snapshot.value = JSON.stringify(settings.value);
  };

  const isDirty = computed(() => snapshot.value !== null && JSON.stringify(settings.value) !== snapshot.value);

  const load = async () => {
    await init();
    takeSnapshot();
  };

  const save = async () => {
    await persist();
    takeSnapshot();
  };

  return { isDirty, load, save, reset: load };
}
