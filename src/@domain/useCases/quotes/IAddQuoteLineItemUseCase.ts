import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';

export interface IAddQuoteLineItemUseCase {
  executeQuote(lineItem: LineItemViewModel): Promise<LineItemViewModel>;
}
