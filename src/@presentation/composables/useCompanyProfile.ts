import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { ref, watch } from 'vue';
import { CompanyProfile, defaultCompanyProfile } from '../types/models/CompanyProfile';

// Résolution lazy : on n'accède au container qu'à l'appel, pas au chargement du module
const _getAuthState = (): IAuthState => container.get<IAuthState>(SYMBOLS.States.AuthState);

const _storageKey = () => {
  try {
    return `company_profile_${_getAuthState().user.value?.id ?? 'default'}`;
  } catch {
    return 'company_profile_default';
  }
};

const _load = (): CompanyProfile => {
  try {
    const raw = localStorage.getItem(_storageKey());
    return raw ? { ...defaultCompanyProfile, ...JSON.parse(raw) } : { ...defaultCompanyProfile };
  } catch {
    return { ...defaultCompanyProfile };
  }
};

const _save = (profile: CompanyProfile) => {
  try {
    localStorage.setItem(_storageKey(), JSON.stringify(profile));
  } catch { /* ignore */ }
};

// Singleton réactif — initialisé au premier accès réel
const _profile = ref<CompanyProfile>({ ...defaultCompanyProfile });
let _initialized = false;

const _ensureInit = () => {
  if (_initialized) return;
  _initialized = true;
  _profile.value = _load();
};

export function useCompanyProfile() {
  _ensureInit();

  // Reload si l'utilisateur change
  try {
    watch(
      () => _getAuthState().user.value?.id,
      () => { _profile.value = _load(); },
    );
  } catch { /* container pas encore prêt */ }

  const saveProfile = (profile: CompanyProfile) => {
    _profile.value = { ...profile };
    _save(_profile.value);
  };

  const resetProfile = () => {
    _profile.value = { ...defaultCompanyProfile };
    _save(_profile.value);
  };

  return {
    profile: _profile,
    saveProfile,
    resetProfile,
  };
}

/** Accès synchrone sans réactivité Vue (pour les templates PDF) */
export const getCompanyProfile = (): CompanyProfile => {
  _ensureInit();
  return _profile.value;
};
