// 📁 application/useCases/quotes/SendQuoteUseCase.ts

import { OrganizationProfileDto } from '@/features/organizations/application/dtos/OrganizationProfileDto';
import { IGenerateQuotePdfUseCase } from '@/features/quotes/application/useCases/GenerateQuotePdfUseCase';
import { IViewQuoteUseCase } from '@/features/quotes/application/useCases/ViewQuoteUseCase';
import { IEmailService } from '@/shared/application/ports/IEmailService';
import { IQuoteRepository } from '@/features/quotes/application/ports/repositories/IQuoteRepository';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { DocumentStatusDto } from '@/features/documentStatuses/application/dtos/DocumentStatusDto';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';

export interface ISendQuoteUseCase {
  execute(quoteId: string, company?: OrganizationProfileDto | null): Promise<DocumentStatusDto>;
}

export const EMPTY_QUOTE_ERROR = "Ajoutez au moins un élément avant d'envoyer le devis.";

export class SendQuoteUseCase implements ISendQuoteUseCase {
  constructor(
    private readonly viewQuoteUseCase: IViewQuoteUseCase,

    private readonly generatePdfUseCase: IGenerateQuotePdfUseCase,

    private readonly emailService: IEmailService,

    private readonly quoteRepository: IQuoteRepository,

    private readonly organizationProfileUseCase: IOrganizationProfileUseCase,

    private readonly getDocumentStatusUseCase: IGetDocumentStatusUseCase,
  ) {}

  async execute(quoteId: string, _company?: OrganizationProfileDto | null): Promise<DocumentStatusDto> {
    const { quote, lines } = await this.viewQuoteUseCase.execute(quoteId);

    if (!quote || !lines) {
      throw new Error('Quote or quote details not found');
    }

    const hasItems = quote.isForfait ? Number(quote.forfaitAmount ?? 0) > 0 : lines.length > 0;
    if (!hasItems) {
      throw new Error(EMPTY_QUOTE_ERROR);
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

    if (!quote.organization_id) {
      throw new Error('Organization not found');
    }

    const pdfBase64 = await this.urlToBase64(pdfDataUrl);
    await this.emailService.sendQuoteEmail(recipientEmail, quote.quoteNumber, pdfBase64, quote.organization_id);
    await this.quoteRepository.markAsSent(quoteId);

    const pendingStatus = await this.getDocumentStatusUseCase.getByCode('pending');
    if (!pendingStatus?.id) throw new Error('Statut introuvable : pending');
    await this.quoteRepository.updateStatus(quoteId, pendingStatus.id);
    return pendingStatus;
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
