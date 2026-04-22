import { LineItemDto } from "@/@application/dtos/LineItemDto";

export interface IQuoteDetailRepository {
  getAllByQuoteId(quoteId: string): Promise<LineItemDto[]>;
  get(id: string): Promise<LineItemDto[] | null>;
  insert(items: LineItemDto): Promise<LineItemDto>;
  update(items: LineItemDto[]): Promise<LineItemDto[]>;
  delete(id: string): Promise<void>;
}
