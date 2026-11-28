import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import type { IListPlatformPlansUseCase } from '@/features/platformAdmin/application/useCases/ListPlatformPlansUseCase';
import type { IPreviewPlanChangesUseCase } from '@/features/platformAdmin/application/useCases/PreviewPlanChangesUseCase';
import type { IApplyPlanChangesUseCase } from '@/features/platformAdmin/application/useCases/ApplyPlanChangesUseCase';
import type { IListPlanChangeLogUseCase } from '@/features/platformAdmin/application/useCases/ListPlanChangeLogUseCase';
import { createUsePlatformPlans, type IUsePlatformPlans } from '@/features/platformAdmin/presentation/composables/usePlatformPlans';

export function usePlatformPlans(): IUsePlatformPlans {
  return createUsePlatformPlans({
    listPlatformPlansUseCase: container.get<IListPlatformPlansUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlatformPlansUseCase),
    previewPlanChangesUseCase: container.get<IPreviewPlanChangesUseCase>(SYMBOLS.UseCases.PlatformAdmin.PreviewPlanChangesUseCase),
    applyPlanChangesUseCase: container.get<IApplyPlanChangesUseCase>(SYMBOLS.UseCases.PlatformAdmin.ApplyPlanChangesUseCase),
    listPlanChangeLogUseCase: container.get<IListPlanChangeLogUseCase>(SYMBOLS.UseCases.PlatformAdmin.ListPlanChangeLogUseCase),
  });
}
