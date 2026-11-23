import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IGetInvoiceUseCase } from '@/features/invoices/application/useCases/GetInvoiceUseCase';
import { IGetInvoiceDetailUseCase } from '@/features/invoices/application/useCases/GetInvoiceDetailUseCase';
import { IDeleteInvoiceUseCase } from '@/features/invoices/application/useCases/DeleteInvoiceUseCase';
import { ISendInvoiceUseCase } from '@/features/invoices/application/useCases/SendInvoiceUseCase';
import { IUpdateInvoiceUseCase } from '@/features/invoices/application/useCases/UpdateInvoiceUseCase';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { IBodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { IBodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { IDentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';
import { ISettingPriceUseCase } from '@/features/priceSettings/application/useCases/SettingPriceUseCase';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { ICalculateLineCostUseCase } from '@/features/costCalculation/application/useCases/CalculateLineCostUseCase';
import { IAddInvoiceLineItemUseCase } from '@/features/invoices/application/useCases/AddInvoiceLineItemUseCase';
import { IDeleteLineItemUseCase } from '@/features/lineItems/application/useCases/DeleteLineItemUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseEditInvoiceState } from '@/features/invoices/presentation/composables/useEditInvoiceState';

export function useEditInvoiceState() {
  return createUseEditInvoiceState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    getInvoiceUseCase: container.get<IGetInvoiceUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceUseCase),
    getInvoiceDetailUseCase: container.get<IGetInvoiceDetailUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceDetailsUseCase),
    deleteInvoiceUseCase: container.get<IDeleteInvoiceUseCase>(SYMBOLS.UseCases.Invoice.DeleteInvoiceUseCase),
    sendInvoiceUseCase: container.get<ISendInvoiceUseCase>(SYMBOLS.UseCases.Invoice.SendInvoiceUseCase),
    updateInvoiceUseCase: container.get<IUpdateInvoiceUseCase>(SYMBOLS.UseCases.Invoice.UpdateInvoiceUseCase),
    garageUseCase: container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage),
    technicianUseCase: container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase),
    bodyPartUseCase: container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase),
    bodyMaterialUseCase: container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase),
    repairTypeUseCase: container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase),
    priceParamsUseCase: container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase),
    getDocumentStatuseUseCase: container.get<IGetDocumentStatusUseCase>(SYMBOLS.UseCases.GetDocumentStatus),
    calculateLineCostUseCase: container.get<ICalculateLineCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase),
    addInvoiceDetailsUseCase: container.get<IAddInvoiceLineItemUseCase>(SYMBOLS.UseCases.Invoice.AddLineItemUseCase),
    deleteLineItemUseCase: container.get<IDeleteLineItemUseCase>(SYMBOLS.UseCases.Quote.DeleteLineItemUseCase),
  });
}
