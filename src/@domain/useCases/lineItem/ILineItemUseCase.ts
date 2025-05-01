
export interface IDeleteLineItemUseCase {
  execute(lineId: string): Promise<void>;
}
