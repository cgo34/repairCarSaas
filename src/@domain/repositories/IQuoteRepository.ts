import { Quote } from '@/@domain/entities/Quote';

export interface IQuoteRepository {
  getAll(): Promise<Quote[]>;
  getById(id: string): Promise<Quote | null>;
  create(quote: Quote): Promise<void>;
  update(quote: Quote): Promise<void>;
  delete(id: string): Promise<void>;
}
