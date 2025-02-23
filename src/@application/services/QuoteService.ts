import { Quote } from '@/@domain/entities/Quote';
import { supabase } from '@/@infrastructure/database/clients/SupabaseClient';

export class QuoteService {
  async getAllQuotes(): Promise<Quote[]> {
    const { data, error } = await supabase.from('quotes').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async createQuote(quote: Quote) {
    const { error } = await supabase.from('quotes').insert(quote);
    if (error) throw new Error(error.message);
  }
}
