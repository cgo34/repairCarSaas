import { TechnicianStatsDto } from '@/@application/dtos/TechnicianStatsDto';
import { IGetTechnicianStatsUseCase } from '@/@domain/useCases/technicians/IGetTechnicianStatsUseCase';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';

@injectable()
export class GetTechnicianStatsUseCase implements IGetTechnicianStatsUseCase {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider)
    private readonly clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async execute(technicianId: string): Promise<TechnicianStatsDto> {
    const client = this.clientProvider.getClient();

    // Requête 1 : devis du technicien
    const { data: quotesData, error: quotesError } = await client
      .from('quotes')
      .select('id')
      .eq('technician_id', technicianId)
      .returns<{ id: string }[]>();

    if (quotesError) console.error('[Stats] quotes error:', quotesError.message);

    // Requête 2 : factures du technicien
    const { data: invoicesData, error: invoicesError } = await client
      .from('invoices')
      .select('id, total_ht')
      .eq('technician_id', technicianId)
      .returns<{ id: string; total_ht: number }[]>();

    if (invoicesError) console.error('[Stats] invoices error:', invoicesError.message);

    const quotes = quotesData ?? [];
    const invoices = invoicesData ?? [];
    const totalHt = invoices.reduce((sum, inv) => sum + (inv.total_ht ?? 0), 0);

    // Requête 3 : commission du technicien
    const { data: userData, error: userError } = await client
      .from('users')
      .select('percentage_commission')
      .eq('id', technicianId)
      .maybeSingle<{ percentage_commission: number | string }>();

    if (userError) console.error('[Stats] commission error:', userError.message);
    console.log('[Stats] technicianId:', technicianId, '| userData:', userData, '| totalHt:', totalHt);

    const pct = parseFloat(String(userData?.percentage_commission ?? 0));

    return {
      technicianId,
      quotesInProgress: quotes.length,
      invoicesCount: invoices.length,
      commissionDue: Math.round((totalHt * pct) / 100 * 100) / 100,
    };
  }
}
