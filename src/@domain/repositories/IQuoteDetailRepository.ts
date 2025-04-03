import { LineItemDto } from "@/@infrastructure/dtos/LineItemDto";

export interface IQuoteDetailRepository {
  getAllByQuoteId(quoteId: string): Promise<LineItemDto[]>;
  get(id: string): Promise<LineItemDto[] | null>;
  insert(items: LineItemDto[]): Promise<void>;
  update(item: LineItemDto): Promise<LineItemDto>;
  delete(id: string): Promise<void>;
}
