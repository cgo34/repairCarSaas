// 📁 application/useCases/quotes/SendQuoteUseCase.ts

import { OrganizationProfileDto } from '@/features/organizations/application/dtos/OrganizationProfileDto';
import { IGenerateQuotePdfUseCase } from '@/features/quotes/application/useCases/GenerateQuotePdfUseCase';
import { IViewQuoteUseCase } from '@/features/quotes/application/useCases/ViewQuoteUseCase';
import { IEmailService } from '@/shared/application/ports/IEmailService';
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';

export interface ISendQuoteUseCase {
  execute(quoteId: string, company?: OrganizationProfileDto | null): Promise<void>;
}

export class SendQuoteUseCase implements ISendQuoteUseCase {
  constructor(
    private readonly viewQuoteUseCase: IViewQuoteUseCase,

    private readonly generatePdfUseCase: IGenerateQuotePdfUseCase,

    private readonly emailService: IEmailService,

    private readonly quoteRepository: IQuoteRepository,

    private readonly organizationProfileUseCase: IOrganizationProfileUseCase,
  ) {}

  async execute(quoteId: string, _company?: OrganizationProfileDto | null): Promise<void> {
    const { quote, lines } = await this.viewQuoteUseCase.execute(quoteId);

    if (!quote || !lines) {
      throw new Error('Quote or quote details not found');
    }

    const company = quote.organization_id
      ? await this.organizationProfileUseCase.getProfile(quote.organization_id)
      : null;

    const pdfDataUrl = await this.generatePdfUseCase.execute(quote, lines, company);
    if (!pdfDataUrl) {
      throw new Error('Failed to generate PDF');
    }

    const recipientEmail = quote.garage?.email ?? quote.garageEmail;
    if (!recipientEmail) {
      throw new Error('Garage email not found');
    }

    const pdfBase64 = await this.urlToBase64(pdfDataUrl);
    await this.emailService.sendQuoteEmail(recipientEmail, quote.quoteNumber, pdfBase64);
    await this.quoteRepository.markAsSent(quoteId);
  }

  private async urlToBase64(url: string): Promise<string> {
    // Handle blob URLs (e.g., "blob:http://localhost:5173/xxx")
    if (url.startsWith('blob:')) {
      const response = await fetch(url);
      const blob = await response.blob();
      return await this.blobToBase64(blob);
    }
    
    // Handle data URLs (e.g., "data:application/pdf;base64,...")
    if (url.startsWith('data:')) {
      return this.extractBase64FromDataUrl(url);
    }
    
    throw new Error('Unsupported URL format for PDF');
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Extract base64 from the data URL
        const base64 = this.extractBase64FromDataUrl(dataUrl);
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }


  private extractBase64FromDataUrl(dataUrl: string): string {
    const base64Marker = ';base64,';
    const base64Index = dataUrl.indexOf(base64Marker);
    if (base64Index === -1) {
      throw new Error('Invalid data URL format');
    }
    return dataUrl.substring(base64Index + base64Marker.length);
  }
}
