import { LineItemViewModel } from "@/@presentation/types/models/LineItemViewModel";

export interface ICalculateLineCostUseCase {
  execute(lineItem: LineItemViewModel, priceParams: any): number;
}
