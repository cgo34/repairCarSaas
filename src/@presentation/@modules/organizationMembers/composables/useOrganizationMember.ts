import { computed, ref } from 'vue';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IOrganizationMemberUseCase } from '@/@domain/useCases/organizationMember/IOrganizationMemberUseCase';
import { ICreateOrganizationTechnicianUseCase } from '@/@domain/useCases/organizationMember/ICreateOrganizationTechnicianUseCase';
import { IUseOrganizationMember } from '@/@presentation/types/IUseOrganizationMember';

import { OrganizationMemberFormFactory } from '@/@presentation/factories/OrganizationMemberFormFactory';
import { OrganizationMemberForm } from '@/@presentation/types/forms/OrganizationMemberForm';
import { OrganizationMemberViewModel } from '@/@presentation/types/models/organizations/OrganizationMemberViewmodel';
import { OrganizationMemberMapper } from '@/@presentation/mappers/organizations/OrganizationMemberMapper';

export function useOrganizationMember(): IUseOrganizationMember {
  const authState = container.get<IAuthState>(
    SYMBOLS.States.AuthState
  );

  const organizationMemberUseCase =
    container.get<IOrganizationMemberUseCase>(
      SYMBOLS.UseCases.OrganizationMemberUseCase
    );

  const createOrganizationTechnicianUseCase =
    container.get<ICreateOrganizationTechnicianUseCase>(
      SYMBOLS.UseCases.CreateOrganizationTechnicianUseCase
    );

  /**
   * ============================================================
   * STATE
   * ============================================================
   */

  const _members = ref<OrganizationMemberViewModel[]>([]);

  const _selectedMemberForm = ref<OrganizationMemberForm>(
    OrganizationMemberFormFactory.createEmpty()
  );

  const loading = ref<boolean>(false);

  const error = ref<unknown>(null);

  /**
   * ============================================================
   * INIT
   * ============================================================
   */

  const init = async (): Promise<void> => {
    await getMembers();
  };

  /**
   * ============================================================
   * GET MEMBERS
   * ============================================================
   */

  const getMembers = async (): Promise<
    OrganizationMemberViewModel[]
  > => {
    loading.value = true;

    try {
      const organizationId = authState.userContext.value?.organization.id ?? '';

      const data =
        await organizationMemberUseCase.getMembersByOrganizationId(
          organizationId
        );

      _members.value = data.map(dto =>
        OrganizationMemberMapper.dtoToView(dto)
      );

      return _members.value;
    } catch (e) {
      error.value = e;

      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * ============================================================
   * SELECT MEMBER
   * ============================================================
   */

  const selectMember = (member: OrganizationMemberViewModel): void => {
    _selectedMemberForm.value =OrganizationMemberFormFactory.createFromMember(member);
  };

  /**
   * ============================================================
   * RESET FORM
   * ============================================================
   */

  const resetSelectedMemberForm = (): void => {
    _selectedMemberForm.value = OrganizationMemberFormFactory.createEmpty();
  };

  /**
   * ============================================================
   * ADD MEMBER
   * ============================================================
   */

  const addMember = async (form: OrganizationMemberForm): Promise<void> => {
    loading.value = true;

    try {

      const organizationId = authState.userContext.value?.organization.id ?? '';

      const createdMember = await createOrganizationTechnicianUseCase.execute({
        organization_id: organizationId,

        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,

        role: form.role,

        percentage_commission: form.percentage_commission,
      });

      console.log('Created member:', createdMember);

      _members.value.push(createdMember);

      resetSelectedMemberForm();
    } catch (e) {
      error.value = e;

      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * ============================================================
   * UPDATE MEMBER
   * ============================================================
   */

  const updateMember = async (form: OrganizationMemberForm): Promise<void> => {
    loading.value = true;

    try {
      if (!form.id) {
        throw new Error('Member id is required');
      }

      const dto = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,

        role: form.role,

        percentage_commission:
          form.percentage_commission,
      };

      await organizationMemberUseCase.updateUser(
        form.id,
        dto
      );

      _members.value = _members.value.map(member =>
        member.id === form.id
          ? {
              ...member,

              role: form.role,

              percentage_commission:
                form.percentage_commission,

              users: {
                ...member.users,

                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
              },
            }
          : member
      );

      const updatedMember =
        _members.value.find(
          member => member.id === form.id
        );

      if (!updatedMember) {
        throw new Error('Updated member not found');
      }

      resetSelectedMemberForm();
    } catch (e) {
      error.value = e;

      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * ============================================================
   * ARCHIVE MEMBER
   * ============================================================
   */

  const archiveMember = async (id: string): Promise<void> => {
    loading.value = true;

    try {
      await organizationMemberUseCase.archiveMember(id)

      _members.value = _members.value.map(member =>
        member.id === id
          ? { ...member, status: 'archived' }
          : member
      )
    } catch (e) {
      error.value = e;

      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * ============================================================
   * EXPOSE
   * ============================================================
   */

  return {
    members: computed(() => _members.value),

    selectedMemberForm: computed(
      () => _selectedMemberForm.value
    ),

    loading,

    error,

    init,

    getMembers,

    selectMember,

    addMember,

    updateMember,

    archiveMember,

    resetSelectedMemberForm,
  };
}