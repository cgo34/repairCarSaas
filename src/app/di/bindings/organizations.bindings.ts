import type { Container } from 'inversify';
import { SYMBOLS } from '@/app/di/tokens';
import { OrganizationRepository } from '@/features/organizations/infrastructure/repositories/OrganizationRepository';
import { OrganizationMemberRepository } from '@/features/organizations/infrastructure/repositories/OrganizationMemberRepository';
import { OrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { OrganizationProfileRepository } from '@/features/organizations/infrastructure/repositories/OrganizationProfileRepository';
import { IOrganizationRepository } from '@/features/organizations/application/ports/repositories/IOrganizationRepository';
import { IOrganizationMemberRepository } from '@/features/organizations/application/ports/repositories/IOrganizationMemberRepository';
import { IOrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { OrganizationMemberUseCase } from '@/features/organizations/application/useCases/OrganizationMemberUseCase';
import { IUseOrganizationMember } from '@/features/organizations/presentation/types/IUseOrganizationMember';
import { useOrganizationMember } from '@/features/organizations/composition/useOrganizationMember';
import { IOrganizationProfileRepository } from '@/features/organizations/application/ports/repositories/IOrganizationProfileRepository';
import { IOrganizationProfileUseCase } from '@/features/organizations/application/useCases/OrganizationProfileUseCase';
import { IUseOrganizationProfileState } from '@/features/organizations/presentation/types/IUseOrganizationProfile';
import { useOrganizationProfileState } from '@/features/organizations/composition/useOrganizationProfileState';

export function registerOrganizationsBindings(container: Container): void {
  container.bind<IOrganizationProfileRepository>(SYMBOLS.Repositories.OrganizationProfileRepository).toDynamicValue(ctx => new OrganizationProfileRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope
  container.bind<IOrganizationRepository>(SYMBOLS.Repositories.OrganizationRepository).toDynamicValue(ctx => new OrganizationRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IOrganizationMemberRepository>(SYMBOLS.Repositories.OrganizationMemberRepository).toDynamicValue(ctx => new OrganizationMemberRepository(ctx.container.get(SYMBOLS.Providers.ClientProvider))).inSingletonScope();
  container.bind<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase).toDynamicValue(ctx => new OrganizationMemberUseCase(ctx.container.get(SYMBOLS.Repositories.OrganizationMemberRepository))).inSingletonScope();
  container.bind<IOrganizationProfileUseCase>(SYMBOLS.UseCases.OrganizationProfileUseCase).toDynamicValue(ctx => new OrganizationProfileUseCase(ctx.container.get(SYMBOLS.Repositories.OrganizationProfileRepository))).inSingletonScope();
  container.bind<IUseOrganizationMember>(SYMBOLS.States.OrganizationMemberState).toDynamicValue(() => {
    return useOrganizationMember();
  });
  container.bind<IUseOrganizationProfileState>(SYMBOLS.States.OrganizationProfileState).toDynamicValue(() => {
    return useOrganizationProfileState();
  });
}
