import { Invoice } from '@/@domain/entities/Invoice';
import { supabase } from '@/@infrastructure/database/clients/SupabaseClient';

export class InvoiceService {
  async getAllInvoices(): Promise<Invoice[]> {
    const { data, error } = await supabase.from('invoices').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async createInvoice(invoice: Invoice) {
    const { error } = await supabase.from('invoices').insert(invoice);
    if (error) throw new Error(error.message);
  }
}
