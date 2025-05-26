export interface ISubscribeToFreePlanUseCase {
  execute(userId: string): Promise<any>;
}
