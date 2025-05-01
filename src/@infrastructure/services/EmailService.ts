import { IEmailService } from '@/@domain/services/IEmailService';
import { injectable } from 'inversify';

@injectable()
export class EmailService implements IEmailService {
  async sendQuotePdf(to: string, subject: string, pdf: Blob, filename: string): Promise<void> {
    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('attachment', pdf, filename);

    const response = await fetch('/api/send-email', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Échec de l’envoi de l’email');
    }
  }
}
