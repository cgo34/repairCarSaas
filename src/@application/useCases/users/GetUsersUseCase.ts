import { UserService } from '@/@application/services/UserService';

export class GetUsersUseCase {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute() {
    return await this.userService.getAllUsers();
  }
}
