import { IRegionManager } from '@/shared/application/ports/IRegionManager';
import { IUseEditInvoiceState } from '@/features/invoices/presentation/types/IUseEditInvoiceState';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';

export function useEditInvoicePageDependencies() {
  return {
    regionManager: container.get<IRegionManager>(SYMBOLS.Managers.regionManager),
    useEditInvoiceState: container.get<IUseEditInvoiceState>(SYMBOLS.States.Invoice.EditInvoiceState),
  };
}
