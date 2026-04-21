import { computed, ref, Ref } from 'vue';

export type PeriodPreset = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

export interface PeriodPresetOption {
  key: PeriodPreset;
  label: string;
}

export interface UsePeriodFilterOptions<T> {
  /** Liste réactive d'items à filtrer */
  items: Ref<T[]>;
  /** Fonction pour extraire la date d'un item (retourne une string ISO ou Date) */
  getDate: (item: T) => string | Date | undefined;
}

export interface UsePeriodFilterReturn<T> {
  /** Date de début du filtre (format YYYY-MM-DD) */
  dateFrom: Ref<string>;
  /** Date de fin du filtre (format YYYY-MM-DD) */
  dateTo: Ref<string>;
  /** Preset actif */
  activePreset: Ref<PeriodPreset>;
  /** Options de presets disponibles */
  datePresets: PeriodPresetOption[];
  /** Liste filtrée */
  filteredItems: Ref<T[]>;
  /** Applique un preset */
  applyPreset: (key: PeriodPreset) => void;
  /** Réinitialise le filtre */
  clearFilter: () => void;
  /** Indique si un filtre est actif */
  hasActiveFilter: Ref<boolean>;
}

export function usePeriodFilter<T>(options: UsePeriodFilterOptions<T>): UsePeriodFilterReturn<T> {
  const { items, getDate } = options;

  const dateFrom = ref('');
  const dateTo = ref('');
  const activePreset = ref<PeriodPreset>('all');

  const datePresets: PeriodPresetOption[] = [
    { key: 'all', label: 'Tout' },
    { key: 'today', label: "Aujourd'hui" },
    { key: 'week', label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' },
    { key: 'year', label: 'Cette année' },
  ];

  const formatDate = (d: Date): string => d.toISOString().split('T')[0];

  const applyPreset = (key: PeriodPreset) => {
    activePreset.value = key;
    const now = new Date();

    switch (key) {
      case 'all':
        dateFrom.value = '';
        dateTo.value = '';
        break;
      case 'today':
        dateFrom.value = formatDate(now);
        dateTo.value = formatDate(now);
        break;
      case 'week': {
        const monday = new Date(now);
        monday.setDate(now.getDate() - now.getDay() + 1);
        dateFrom.value = formatDate(monday);
        dateTo.value = formatDate(now);
        break;
      }
      case 'month':
        dateFrom.value = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
        dateTo.value = formatDate(now);
        break;
      case 'year':
        dateFrom.value = formatDate(new Date(now.getFullYear(), 0, 1));
        dateTo.value = formatDate(now);
        break;
      case 'custom':
        // Ne rien faire, les dates sont déjà définies manuellement
        break;
    }
  };

  const clearFilter = () => {
    dateFrom.value = '';
    dateTo.value = '';
    activePreset.value = 'all';
  };

  const hasActiveFilter = computed(() => Boolean(dateFrom.value || dateTo.value));

  const filteredItems = computed(() => {
    if (!dateFrom.value && !dateTo.value) {
      return items.value;
    }

    return items.value.filter((item) => {
      const itemDate = getDate(item);
      if (!itemDate) return false;

      const dateStr = typeof itemDate === 'string'
        ? new Date(itemDate).toISOString().split('T')[0]
        : itemDate.toISOString().split('T')[0];

      if (dateFrom.value && dateStr < dateFrom.value) return false;
      if (dateTo.value && dateStr > dateTo.value) return false;

      return true;
    });
  });

  return {
    dateFrom,
    dateTo,
    activePreset,
    datePresets,
    filteredItems,
    applyPreset,
    clearFilter,
    hasActiveFilter,
  };
}
