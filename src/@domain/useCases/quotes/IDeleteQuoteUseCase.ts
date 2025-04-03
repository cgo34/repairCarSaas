export interface IDeleteQuoteUseCase {
  execute(quoteId: string): Promise<void>;
}