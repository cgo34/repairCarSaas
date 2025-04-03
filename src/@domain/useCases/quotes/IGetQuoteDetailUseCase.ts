import { LineItemDto } from "@/@infrastructure/dtos/LineItemDto";

export interface IGetQuoteDetailUseCase {
  execute(quoteId: string): Promise<LineItemDto[] | null>;
}