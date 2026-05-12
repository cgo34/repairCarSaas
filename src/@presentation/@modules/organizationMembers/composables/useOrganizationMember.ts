import { CreateOrganizationTechnicianDto } from '@/@application/dtos/organizations/CreateOrganizationTechnicianDto';
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IUserUseCase } from '@/@domain/useCases/IUserUseCase';
import { ICreateOrganizationTechnicianUseCase } from '@/@domain/useCases/organizationMember/ICreateOrganizationTechnicianUseCase';
import { IOrganizationMemberUseCase } from '@/@domain/useCases/organizationMember/IOrganizationMemberUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { OrganizationMemberMapper } from '@/@infrastructure/mappers/OrganizationMemberMapper';
import { UserMapper } from '@/@presentation/mappers/UserMapper';
import { IUseUserState } from '@/@presentation/types/composables/IUseUserState';
import { IUseOrganizationMember } from '@/@presentation/types/IUseOrganizationMember';
import { OrganizationMemberViewModel } from '@/@presentation/types/models/OrganizationMemberViewmodel';
import { CreateOrganizationTechnicianViewModel } from '@/@presentation/types/models/organizations/CreateOrganizationTechnicianViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { computed, ref } from 'vue';

export function useOrganizationMember(): IUseOrganizationMember {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const organizationMemberUseCase = container.get<IOrganizationMemberUseCase>(SYMBOLS.UseCases.OrganizationMemberUseCase);
  const createOrganizationTechnicianUseCase = container.get<ICreateOrganizationTechnicianUseCase>(SYMBOLS.UseCases.CreateOrganizationTechnicianUseCase);

  const _users = ref<OrganizationMemberViewModel[]>([]);
  const _selectedUser = ref<CreateOrganizationTechnicianViewModel>({
    organization_id: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'technician',
    percentage_commission: 0,
  });
  const _editingUser = ref<OrganizationMemberViewModel | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    return getUsers().then(() => {});
  };

  const getUsers = async (): Promise<OrganizationMemberViewModel[]> => {
    loading.value = true;
    try {
      console.log('Fetching organization members for organization ID:', authState.userContext.value?.organization.id);
      return organizationMemberUseCase.getMembersByOrganizationId(authState.userContext.value?.organization.id ?? '').then((data) => {
        _users.value = data //.map(OrganizationMemberMapper.dtoToView);
        return _users.value;
      });
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const selectUser = (user: CreateOrganizationTechnicianViewModel): void => {
    _selectedUser.value = { ...user };
  };

  const editUser = (user: OrganizationMemberViewModel): void => {
    _editingUser.value = {
      organization_id: user.organization_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      percentage_commission: user.percentage_commission,
    };
  }

  const resetSelectedUser = (): void => {
    _selectedUser.value = {
      organization_id: '',
      first_name: '',
      last_name: '',
      email: '',
      role: 'technician',
      percentage_commission: 0,
    };
  };

  const addUser = async (user: CreateOrganizationTechnicianViewModel) => {
    loading.value = true;
    console.log('Adding user with data:', user);
    try {
      return createOrganizationTechnicianUseCase.execute({
          ...user,
          organization_id: authState.userContext.value?.organization.id ?? '',
        }).then((data) => {
          const newUser = data //OrganizationMemberMapper.dtoToView(data);
          console.log('User added successfully:', newUser);
          _users.value.push(newUser);
          resetSelectedUser();
          return newUser;
        });
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (user: OrganizationMemberViewModel): Promise<OrganizationMemberViewModel> => {
    loading.value = true;
    try {
      const dto = OrganizationMemberMapper.viewToDto(user);
      await organizationMemberUseCase.updateUser(user.id, dto);
      _users.value = _users.value.map((u) => (u.id === user.id ? { ...user } : u));
      return { ...user };
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: string) => {
    loading.value = true;
    try {
      return organizationMemberUseCase.archiveMember(id).then(() => {
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    users: computed(() => _users.value),
    selectedUser: computed(() => _selectedUser.value),
    loading,
    error,
    init,
    getUsers,
    selectUser,
    addUser,
    updateUser,
    deleteUser,
    resetSelectedUser,
  };
}
