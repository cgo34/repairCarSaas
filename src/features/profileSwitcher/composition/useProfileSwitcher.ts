import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { IListDemoProfilesUseCase } from '@/features/profileSwitcher/application/useCases/ListDemoProfilesUseCase';
import type { ISwitchDemoProfileUseCase } from '@/features/profileSwitcher/application/useCases/SwitchDemoProfileUseCase';
import type { IClearDemoProfileUseCase } from '@/features/profileSwitcher/application/useCases/ClearDemoProfileUseCase';
import type { ICreateDemoProfileUseCase } from '@/features/profileSwitcher/application/useCases/CreateDemoProfileUseCase';
import type { IDeleteDemoProfileUseCase } from '@/features/profileSwitcher/application/useCases/DeleteDemoProfileUseCase';
import { createUseProfileSwitcher, type IUseProfileSwitcher } from '@/features/profileSwitcher/presentation/composables/useProfileSwitcher';

export function useProfileSwitcher(): IUseProfileSwitcher {
  return createUseProfileSwitcher({
    listProfilesUseCase: container.get<IListDemoProfilesUseCase>(SYMBOLS.UseCases.ProfileSwitcher.ListDemoProfilesUseCase),
    switchProfileUseCase: container.get<ISwitchDemoProfileUseCase>(SYMBOLS.UseCases.ProfileSwitcher.SwitchDemoProfileUseCase),
    clearProfileUseCase: container.get<IClearDemoProfileUseCase>(SYMBOLS.UseCases.ProfileSwitcher.ClearDemoProfileUseCase),
    createProfileUseCase: container.get<ICreateDemoProfileUseCase>(SYMBOLS.UseCases.ProfileSwitcher.CreateDemoProfileUseCase),
    deleteProfileUseCase: container.get<IDeleteDemoProfileUseCase>(SYMBOLS.UseCases.ProfileSwitcher.DeleteDemoProfileUseCase),
  });
}
