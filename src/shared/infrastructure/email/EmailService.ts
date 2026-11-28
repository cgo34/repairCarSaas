import { IEmailService, SendEmailParams } from '@/shared/application/ports/IEmailService';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';

export class EmailService implements IEmailService {
  constructor(
    private clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async sendEmail(params: SendEmailParams): Promise<void> {
  const supabase = this.clientProvider.getClient();

  const { data, error } = await supabase.functions.invoke('mailjet-email', {
    body: {
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
      attachments: params.attachments,
      documentType: params.documentType,
      organizationId: params.organizationId,
    },
  });

  if (error) {
    console.error('[EmailService] Error sending email:', error);
    if ((error as { context?: Response }).context?.status === 403) {
      throw new Error('FEATURE_NOT_AVAILABLE: ' + (params.documentType === 'quote' ? 'quote_email_sending' : 'invoice_email_sending'));
    }
    throw new Error('Echec de l envoi de l email: ' + error.message);
  }

  console.log('[EmailService] Email sent successfully:', data);
}

  async sendInvoiceEmail(to: string, invoiceNumber: string, pdfBase64: string, organizationId: string): Promise<void> {
    await this.sendEmail({
      to,
      documentType: 'invoice',
      organizationId,
      subject: 'Votre facture ' + invoiceNumber,
      htmlContent: '<h1>Votre facture ' + invoiceNumber + '</h1><p>Bonjour,</p><p>Veuillez trouver ci-joint votre facture.</p><p>Merci pour votre confiance.</p><p>Cordialement,</p>',
      textContent: 'Votre facture ' + invoiceNumber + '\n\nBonjour,\n\nVeuillez trouver ci-joint votre facture.\n\nMerci pour votre confiance.\n\nCordialement,',
      attachments: [
        {
          content: pdfBase64,
          filename: 'facture-' + invoiceNumber + '.pdf',
          contentType: 'application/pdf',
        },
      ],
    });
  }

  async sendQuoteEmail(to: string, quoteNumber: string, pdfBase64: string, organizationId: string): Promise<void> {
    await this.sendEmail({
      to,
      documentType: 'quote',
      organizationId,
      subject: 'Votre devis ' + quoteNumber,
      htmlContent: '<h1>Votre devis ' + quoteNumber + '</h1><p>Bonjour,</p><p>Veuillez trouver ci-joint votre devis.</p><p>Cordialement,</p>',
      textContent: 'Votre devis ' + quoteNumber + '\n\nBonjour,\n\nVeuillez trouver ci-joint votre devis.\n\nCordialement,',
      attachments: [
        {
          content: pdfBase64,
          filename: 'devis-' + quoteNumber + '.pdf',
          contentType: 'application/pdf',
        },
      ],
    });
  }
}
