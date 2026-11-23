import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { EmailService } from '@/shared/infrastructure/email/EmailService';
import { IRegionManager } from '@/shared/application/ports/IRegionManager';
import { RegionManager } from '@/shared/infrastructure/region/RegionManager';
import { IDownloadService } from '@/shared/application/ports/IDownloadService';
import { IPdfGenerator } from '@/shared/application/ports/IPdfGenerator';
import { IClientProvider } from '@/shared/infrastructure/supabase/IClientProvider';
import { SupabaseClient } from '@/shared/infrastructure/supabase/SupabaseClient';
import { SupabaseClientProvider } from '@/shared/infrastructure/supabase/SupabaseClientProvider';
import { BrowserDownloadService } from '@/shared/infrastructure/download/BrowserDownloadService';
import { IClient } from '@/shared/infrastructure/supabase/IClient';
import { IEmailService } from '@/shared/application/ports/IEmailService';
import { Html2PdfGenerator } from '@/shared/infrastructure/pdf/Html2PdfGenerator';

export function registerSharedBindings(container: Container): void {
  container.bind<IRegionManager>(SYMBOLS.Managers.regionManager).toDynamicValue(() => new RegionManager()).inSingletonScope();
  container.bind<IClient>(SYMBOLS.Clients.SupabaseClient).toDynamicValue(() => new SupabaseClient()).inSingletonScope();
  container.bind<IClientProvider<SupabaseClient>>(SYMBOLS.Providers.ClientProvider).toDynamicValue(ctx => new SupabaseClientProvider(ctx.container.get(SYMBOLS.Clients.SupabaseClient))).inSingletonScope();
  container.bind<IPdfGenerator>(SYMBOLS.Services.PdfGeneratorService).toDynamicValue(() => new Html2PdfGenerator()).inSingletonScope();
  container.bind<IDownloadService>(SYMBOLS.Services.DownloadService).toDynamicValue(() => new BrowserDownloadService());
  container.bind<IEmailService>(SYMBOLS.Services.EmailService).toDynamicValue(ctx => new EmailService(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
}
