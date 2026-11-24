import { container } from '@/app/di/container';
import { SYMBOLS } from '@/app/di/tokens';
import { IGetInvoiceUseCase } from '@/features/invoices/application/useCases/GetInvoiceUseCase';
import { NavigationGuard } from 'vue-router';

// Les éléments ne sont modifiables que sur un brouillon :
// une facture envoyée est verrouillée, on redirige vers la page (lecture seule).
export const invoiceItemsGuard: NavigationGuard = async (to) => {
  const id = Array.isArray(to.params.id) ? to.params.id[0] : to.params.id;
  if (!id) return { path: '/invoices', replace: true };

  try {
    const getInvoiceUseCase = container.get<IGetInvoiceUseCase>(SYMBOLS.UseCases.Invoice.GetInvoiceUseCase);
    const invoice = await getInvoiceUseCase.execute(id);
    const code = invoice?.status?.code ?? '';
    if (code && code !== 'draft') {
      return { path: `/invoices/edit/${id}`, replace: true };
    }
  } catch {
    // En cas d'échec de lecture, la page gère elle-même l'erreur de chargement.
  }

  return true;
};
