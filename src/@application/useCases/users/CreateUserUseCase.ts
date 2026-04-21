import { IUserRepository } from '@/@domain/repositories/IUserRepository';
import { ICreateUserUseCase } from '@/@domain/useCases/user/ICreateUserUseCase';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { UserMapper } from '@/@presentation/mappers/UserMapper';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(user: UserViewModel): Promise<void> {
    // Tu peux ajouter une validation métier ici si besoin
    const dto = UserMapper.viewToDto(user);
    await this.userRepository.createUser(dto);
  }
}
