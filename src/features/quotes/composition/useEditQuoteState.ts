import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { IGetQuoteUseCase } from '@/features/quotes/application/useCases/GetQuoteUseCase';
import { IGetQuoteDetailUseCase } from '@/features/quotes/application/useCases/GetQuoteDetailUseCase';
import { IDeleteQuoteUseCase } from '@/features/quotes/application/useCases/DeleteQuoteUseCase';
import { IGarageUseCase } from '@/features/garages/application/useCases/GarageUseCase';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { IBodyPartUseCase } from '@/features/carRepairSettings/application/useCases/BodyPartUseCase';
import { IBodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { IDentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';
import { ISettingPriceUseCase } from '@/features/priceSettings/application/useCases/SettingPriceUseCase';
import { IUpdateQuoteUseCase } from '@/features/quotes/application/useCases/UpdateQuoteUseCase';
import { ICalculateLineCostUseCase } from '@/features/costCalculation/application/useCases/CalculateLineCostUseCase';
import { IAddQuoteLineItemUseCase } from '@/features/quotes/application/useCases/AddQuoteLineItemUseCase';
import { IUpdateQuoteLineItemUseCase } from '@/features/quotes/application/useCases/UpdateQuoteLineItemUseCase';
import { IDeleteLineItemUseCase } from '@/features/lineItems/application/useCases/DeleteLineItemUseCase';
import { ISendQuoteUseCase } from '@/features/quotes/application/useCases/SendQuoteUseCase';
import { IFinalizeQuoteUseCase } from '@/features/quotes/application/useCases/FinalizeQuoteUseCase';
import { IDuplicateQuoteToInvoiceUseCase } from '@/features/quotes/application/useCases/DuplicateQuoteToInvoiceUseCase';
import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { createUseEditQuoteState } from '@/features/quotes/presentation/composables/useEditQuoteState';

export function useEditQuoteState() {
  return createUseEditQuoteState({
    authState: container.get<IAuthState>(SYMBOLS.States.AuthState),
    getDocumentStatuseUseCase: container.get<IGetDocumentStatusUseCase>(SYMBOLS.UseCases.GetDocumentStatus),
    getQuoteUseCase: container.get<IGetQuoteUseCase>(SYMBOLS.UseCases.Quote.GetQuoteUseCase),
    getQuoteDetailUseCase: container.get<IGetQuoteDetailUseCase>(SYMBOLS.UseCases.Quote.GetQuoteDetailsUseCase),
    deleteQuoteUseCase: container.get<IDeleteQuoteUseCase>(SYMBOLS.UseCases.Quote.DeleteQuoteUseCase),
    garageUseCase: container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage),
    technicianUseCase: container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase),
    bodyPartUseCase: container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase),
    bodyMaterialUseCase: container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase),
    repairTypeUseCase: container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase),
    priceParamsUseCase: container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase),
    updateQuoteUseCase: container.get<IUpdateQuoteUseCase>(SYMBOLS.UseCases.Quote.UpdateQuoteUseCase),
    calculateLineCostUseCase: container.get<ICalculateLineCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase),
    addQuoteDetailsUseCase: container.get<IAddQuoteLineItemUseCase>(SYMBOLS.UseCases.Quote.AddLineItemUseCase),
    deleteLineItemUseCase: container.get<IDeleteLineItemUseCase>(SYMBOLS.UseCases.Quote.DeleteLineItemUseCase),
    updateLineItemUseCase: container.get<IUpdateQuoteLineItemUseCase>(SYMBOLS.UseCases.Quote.UpdateLineItemUseCase),
    sendQuoteUseCase: container.get<ISendQuoteUseCase>(SYMBOLS.UseCases.Quote.SendQuoteUseCase),
    finalizeQuoteUseCase: container.get<IFinalizeQuoteUseCase>(SYMBOLS.UseCases.Quote.FinalizeQuoteUseCase),
    duplicateQuoteToInvoiceUseCase: container.get<IDuplicateQuoteToInvoiceUseCase>(SYMBOLS.UseCases.Quote.DuplicateQuoteToInvoiceUseCase),
  });
}
