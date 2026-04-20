import { IEmailService, SendEmailParams } from '@/@domain/services/IEmailService';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class EmailService implements IEmailService {
  constructor(
    @inject(SYMBOLS.Providers.ClientProvider) private clientProvider: IClientProvider<SupabaseClient>
  ) {}

  async sendEmail(params: SendEmailParams): Promise<void> {
  const supabase = this.clientProvider.getClient();
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  const { data, error } = await supabase.functions.invoke('mailjet-email', {
    body: {
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
      attachments: params.attachments,
    },
    headers: {
      Authorization: `Bearer ${anonKey}`,
    },
  });

  if (error) {
    console.error('[EmailService] Error sending email:', error);
    throw new Error('Echec de l envoi de l email: ' + error.message);
  }

  console.log('[EmailService] Email sent successfully:', data);
}

  async sendInvoiceEmail(to: string, invoiceNumber: string, pdfBase64: string): Promise<void> {
    await this.sendEmail({
      to,
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

  async sendQuoteEmail(to: string, quoteNumber: string, pdfBase64: string): Promise<void> {
    await this.sendEmail({
      to,
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
