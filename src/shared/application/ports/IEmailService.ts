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
  /** Used by the server to check the plan feature before sending. */
  documentType: 'quote' | 'invoice';
  organizationId: string;
}

export interface IEmailService {
  sendEmail(params: SendEmailParams): Promise<void>;
  sendInvoiceEmail(to: string, invoiceNumber: string, pdfBase64: string, organizationId: string): Promise<void>;
  sendQuoteEmail(to: string, quoteNumber: string, pdfBase64: string, organizationId: string): Promise<void>;
}
