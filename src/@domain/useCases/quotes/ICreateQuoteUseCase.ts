export interface ICreateQuoteUseCase {
  execute(userId: string): Promise<string>; // Retourne uniquement le quoteNumber
}
