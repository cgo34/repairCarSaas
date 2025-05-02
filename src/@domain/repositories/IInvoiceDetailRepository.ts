import { LineItemDto } from "@/@infrastructure/dtos/LineItemDto";

export interface IInvoiceDetailRepository {
  getAllByInvoiceId(quoteId: string): Promise<LineItemDto[]>;
  get(id: string): Promise<LineItemDto[] | null>;
  insert(items: LineItemDto): Promise<LineItemDto>;
  update(item: LineItemDto): Promise<LineItemDto>;
  delete(id: string): Promise<void>;
}
