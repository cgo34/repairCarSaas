export interface SettingPriceImpactCountToUtViewModel {
  id: string;
  userId: string;
  impactCountMin: number; // Min du range (ou valeur unique)
  impactCountMax: number; // Max du range (ou = à min si pas d'intervalle)
  unitTime: number; // UT pour cet intervalle
}
