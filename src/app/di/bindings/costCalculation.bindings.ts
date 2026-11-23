import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { CostCalculatorService } from '@/features/costCalculation/application/services/CostCalculatorService';
import { CalculateLineCostUseCase } from '@/features/costCalculation/application/useCases/CalculateLineCostUseCase';
import { CalculateTotalCostUseCase } from '@/features/costCalculation/application/useCases/CalculateTotalCostUseCase';
import { ICostCalculatorService } from '@/features/costCalculation/application/ports/services/ICostCalculatorService';
import { ICalculateLineCostUseCase } from '@/features/costCalculation/application/useCases/CalculateLineCostUseCase';
import { ICalculateTotalCostUseCase } from '@/features/costCalculation/application/useCases/CalculateTotalCostUseCase';

export function registerCostCalculationBindings(container: Container): void {
  container.bind<ICostCalculatorService>(SYMBOLS.Services.CostCalculatorService).toDynamicValue(() => new CostCalculatorService()).inSingletonScope();
  container.bind<ICalculateLineCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase).toDynamicValue(ctx => new CalculateLineCostUseCase(ctx.container.get(SYMBOLS.Services.CostCalculatorService))).inSingletonScope();
  container.bind<ICalculateTotalCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateTotalCostUseCase).toDynamicValue(ctx => new CalculateTotalCostUseCase(ctx.container.get(SYMBOLS.Services.CostCalculatorService))).inSingletonScope();
}
