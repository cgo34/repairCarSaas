import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { GetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { IDocumentStatusRepository } from '@/features/documentStatuses/application/ports/repositories/IDocumentStatusRepository';
import { IGetDocumentStatusUseCase } from '@/features/documentStatuses/application/useCases/GetDocumentStatusUseCase';
import { DocumentStatusRepository } from '@/features/documentStatuses/infrastructure/repositories/DocumentStatusRepository';

export function registerDocumentStatusesBindings(container: Container): void {
  container.bind<IDocumentStatusRepository>(SYMBOLS.Repositories.DocumentStatusRepository).toDynamicValue(ctx => new DocumentStatusRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IGetDocumentStatusUseCase>(SYMBOLS.UseCases.GetDocumentStatus).toDynamicValue(ctx => new GetDocumentStatusUseCase(ctx.container.get(SYMBOLS.Repositories.DocumentStatusRepository))).inSingletonScope();
}
