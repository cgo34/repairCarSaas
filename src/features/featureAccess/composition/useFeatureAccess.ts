import { container } from '@/app/di/container'
import { SYMBOLS } from '@/app/di/tokens'
import type { IAuthState } from '@/features/auth/presentation/state/IAuthState'
import type { IFeatureAccessState } from '@/features/featureAccess/presentation/state/IFeatureAccessState'
import { createUseFeatureAccess } from '@/features/featureAccess/presentation/composables/useFeatureAccess'

export function useFeatureAccess() {
  return createUseFeatureAccess({
    featureAccessState: container.get<IFeatureAccessState>(SYMBOLS.States.FeatureAccessState),
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
  })
}
