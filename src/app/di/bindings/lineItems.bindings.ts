import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { DeleteLineItemUseCase } from '@/features/lineItems/application/useCases/DeleteLineItemUseCase';
import { IDeleteLineItemUseCase } from '@/features/lineItems/application/useCases/DeleteLineItemUseCase';

export function registerLineItemsBindings(container: Container): void {
  container.bind<IDeleteLineItemUseCase>(SYMBOLS.UseCases.Quote.DeleteLineItemUseCase).toDynamicValue(ctx => new DeleteLineItemUseCase(ctx.container.get(SYMBOLS.Repositories.QuoteDetailRepository))).inSingletonScope();
}
