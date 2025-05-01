export interface ISendQuoteUseCase {
  execute(quoteId: string): Promise<void>;
}
