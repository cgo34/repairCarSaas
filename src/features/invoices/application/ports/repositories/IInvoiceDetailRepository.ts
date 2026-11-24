import { LineItemDto } from "@/features/lineItems/application/dtos/LineItemDto";

export interface IInvoiceDetailRepository {
  getAllByInvoiceId(quoteId: string): Promise<LineItemDto[]>;
  get(id: string): Promise<LineItemDto[] | null>;
  insert(item: LineItemDto): Promise<LineItemDto>;
  updateOne(item: LineItemDto): Promise<LineItemDto>;
  insertMultiple(items: LineItemDto[]): Promise<LineItemDto[]>;
  update(items: LineItemDto[]): Promise<LineItemDto[]>;
  delete(id: string): Promise<void>;
}
