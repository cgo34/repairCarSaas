import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { IUseOrganizationProfileState } from '@/features/organizations/presentation/types/IUseOrganizationProfile';

export function useOrganizationProfilePageDependencies() {
  return {
    useOrganizationProfileState: container.get<IUseOrganizationProfileState>(SYMBOLS.States.OrganizationProfileState),
  };
}
