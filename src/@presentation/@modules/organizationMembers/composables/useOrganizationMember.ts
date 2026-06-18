import { computed, ref } from 'vue';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IOrganizationMemberUseCase } from '@/@domain/useCases/organizationMember/IOrganizationMemberUseCase';
import { ICreateOrganizationTechnicianUseCase } from '@/@domain/useCases/organizationMember/ICreateOrganizationTechnicianUseCase';
import { IUseOrganizationMember } from '@/@presentation/types/composables/IUseOrganizationMember';
import { ITechnicianGarageAccessRepository } from '@/@domain/repositories/ITechnicianGarageAccessRepository';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';

import { OrganizationMemberFormFactory } from '@/@presentation/factories/OrganizationMemberFormFactory';
import { OrganizationMemberForm } from '@/@presentation/types/forms/OrganizationMemberForm';
import { OrganizationMemberViewModel } from '@/@presentation/types/models/organizations/OrganizationMemberViewmodel';
import { OrganizationMemberMapper } from '@/@presentation/mappers/organizations/OrganizationMemberMapper';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';

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

  const garageAccessRepo =
    container.get<ITechnicianGarageAccessRepository>(
      SYMBOLS.Repositories.TechnicianGarageAccessRepository
    );

  const garageUseCase =
    container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);

  /**
   * ============================================================
   * STATE
   * ============================================================
   */

  const _members = ref<OrganizationMemberViewModel[]>([]);
  const _garages = ref<GarageViewModel[]>([]);
  const _assignedGarageIds = ref<string[]>([]);

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
    const organizationId = authState.userContext.value?.organization.id ?? '';
    const [, garagesDto] = await Promise.all([
      getMembers(),
      garageUseCase.getGaragesByOrganizationId(organizationId).catch(() => []),
    ]);
    _garages.value = (garagesDto ?? []).map(GarageMapper.dtoToView);
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

      _members.value.push(createdMember);

      if (form.garageIds?.length) {
        await Promise.all(
          form.garageIds.map(garageId =>
            garageAccessRepo.assignGarage(createdMember.user_id, garageId)
          )
        );
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
   * GARAGE ACCESS
   * ============================================================
   */

  const loadAssignedGarages = async (userId: string): Promise<void> => {
    const garages = await garageAccessRepo.getGaragesByTechnicianId(userId);
    _assignedGarageIds.value = garages.map(g => g.id ?? '').filter(Boolean);
  };

  const toggleGarageAccess = async (userId: string, garageId: string, assign: boolean): Promise<void> => {
    if (assign) {
      await garageAccessRepo.assignGarage(userId, garageId);
      if (!_assignedGarageIds.value.includes(garageId)) {
        _assignedGarageIds.value = [..._assignedGarageIds.value, garageId];
      }
    } else {
      await garageAccessRepo.removeGarage(userId, garageId);
      _assignedGarageIds.value = _assignedGarageIds.value.filter(id => id !== garageId);
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

      await organizationMemberUseCase.updateMember(
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
    garages: computed(() => _garages.value),
    assignedGarageIds: computed(() => _assignedGarageIds.value),

    selectedMemberForm: computed(() => _selectedMemberForm.value),

    loading,
    error,

    init,
    getMembers,
    selectMember,
    addMember,
    updateMember,
    archiveMember,
    resetSelectedMemberForm,
    loadAssignedGarages,
    toggleGarageAccess,
  };
}