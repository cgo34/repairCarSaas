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

    // Résoudre le member UUID depuis le user_id
    const { data: memberData, error: memberError } = await client
      .from('organization_members')
      .select('id, percentage_commission')
      .eq('user_id', technicianId)
      .maybeSingle<{ id: string; percentage_commission: number | string }>();

    if (memberError) console.error('[Stats] member error:', memberError.message);

    const memberId = memberData?.id;
    if (!memberId) {
      return { technicianId, quotesInProgress: 0, invoicesCount: 0, commissionDue: 0 };
    }

    // Requête 1 : devis du technicien
    const { data: quotesData, error: quotesError } = await client
      .from('quotes')
      .select('id')
      .or(`assigned_member_id.eq.${memberId},created_by_member_id.eq.${memberId}`)
      .returns<{ id: string }[]>();

    if (quotesError) console.error('[Stats] quotes error:', quotesError.message);

    // Requête 2 : factures du technicien
    const { data: invoicesData, error: invoicesError } = await client
      .from('invoices')
      .select('id, total_ht')
      .or(`assigned_member_id.eq.${memberId},created_by_member_id.eq.${memberId}`)
      .returns<{ id: string; total_ht: number }[]>();

    if (invoicesError) console.error('[Stats] invoices error:', invoicesError.message);

    const quotes = quotesData ?? [];
    const invoices = invoicesData ?? [];
    const totalHt = invoices.reduce((sum, inv) => sum + (inv.total_ht ?? 0), 0);

    const pct = parseFloat(String(memberData?.percentage_commission ?? 0));

    return {
      technicianId,
      quotesInProgress: quotes.length,
      invoicesCount: invoices.length,
      commissionDue: Math.round((totalHt * pct) / 100 * 100) / 100,
    };
  }
}
