import { LineItemDto } from "@/@application/dtos/LineItemDto";

export interface IGetQuoteDetailUseCase {
  execute(quoteId: string): Promise<LineItemDto[] | null>;
}