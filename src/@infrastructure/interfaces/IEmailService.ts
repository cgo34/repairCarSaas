export interface IEmailService {
  sendQuotePdf(
    to: string,
    subject: string,
    pdf: Blob,
    filename: string
  ): Promise<void>;
}
