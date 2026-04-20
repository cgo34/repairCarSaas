import { QuoteViewModel } from "@/@presentation/types/models/QuoteViewModel";

export interface IGetQuoteUseCase {
  execute(userId: string): Promise<QuoteViewModel | null>;
}