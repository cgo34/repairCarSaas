import { useQuotesState } from '@/features/quotes/composition/useQuotesState';

// Réutilise l'état des devis (liste + conversion en facture) pour la modale de sélection
export function useSelectQuoteDialogDependencies() {
  return {
    useQuoteState: useQuotesState(),
  };
}
