import { IUserRepository } from '@/@domain/repositories/IUserRepository';
import { ICreateUserUseCase } from '@/@domain/useCases/user/ICreateUserUseCase';
import { UserDto } from '@/@infrastructure/dtos/UserDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(user: UserDto): Promise<void> {
    // Tu peux ajouter une validation métier ici si besoin
    await this.userRepository.createUser(user);
  }
}
