export interface EmailAttachment {
  content: string; // Base64 encoded content
  filename: string;
  contentType: string;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachments?: EmailAttachment[];
}

export interface IEmailService {
  sendEmail(params: SendEmailParams): Promise<void>;
  sendInvoiceEmail(to: string, invoiceNumber: string, pdfBase64: string): Promise<void>;
  sendQuoteEmail(to: string, quoteNumber: string, pdfBase64: string): Promise<void>;
}
