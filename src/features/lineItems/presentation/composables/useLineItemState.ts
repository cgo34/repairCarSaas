// region -> IMPORTS
import { IAuthState } from '@/features/auth/presentation/state/IAuthState';
import { IBodyMaterialUseCase } from '@/features/carRepairSettings/application/useCases/BodyMaterialUseCase';
import { IDentRepairTypeUseCase } from '@/features/carRepairSettings/application/useCases/DentRepairTypeUSeCase';
import { ISettingPriceUseCase } from '@/features/priceSettings/application/useCases/SettingPriceUseCase';
import { BodyMaterialMapper } from '@/features/carRepairSettings/presentation/mappers/BodyMaterialMapper';
import { RepairTypeMapper } from '@/features/carRepairSettings/presentation/mappers/RepairTypeMapper';
import { SettingPriceMapper } from '@/features/priceSettings/presentation/mappers/SettingPriceMapper';
import { BodyMaterialViewModel } from '@/features/carRepairSettings/presentation/models/BodyMaterialViewModel';
import { DentRepairTypeViewModel } from '@/features/carRepairSettings/presentation/models/DentRepairTypeViewModel';
import { SettingPriceViewModel } from '@/features/priceSettings/presentation/models/SettingPriceViewModel';
import { computed, ref } from 'vue';
// endregion

export interface UseLineItemStateDependencies {
  authState: IAuthState;
  bodyMaterialUseCase: IBodyMaterialUseCase;
  repairTypeUseCase: IDentRepairTypeUseCase;
  priceParamsUseCase: ISettingPriceUseCase;
}

export function createUseLineItemState(deps: UseLineItemStateDependencies) {
  // #region -> DEPENDENCIES
  const { authState, bodyMaterialUseCase, repairTypeUseCase, priceParamsUseCase } = deps;


  // #endregion

  // #region -> CONSTANTS
  // let LINE_ITEM_INCREMENT = 1;
  // #endregion

  // #region -> REFS
  // const _viewType = ref<'form' | 'view'>('form');
  const _priceParams = ref<SettingPriceViewModel>();
  
  const _bodyMaterials = ref<BodyMaterialViewModel[]>([]);
  const _repairTypes = ref<DentRepairTypeViewModel[]>([]);

  // const _lines = ref<LineItemViewModel[]>([]);

  const loading = ref(false);
  const error = ref<unknown>(undefined);
// #endregion

  // #region -> INIT
  const init = async () => {
    loading.value = true;
    try {
      if (!authState.userContext.value)
        throw new Error('User not found');      

      const [bodyMaterialResult, repairTypeResult, priceParamsResult] =
        await Promise.allSettled([
          bodyMaterialUseCase.executeGetAll(),
          repairTypeUseCase.executeGetAll(),
          priceParamsUseCase.getByOrganizationId(authState.userContext.value?.organization.id),
        ]);

      if (bodyMaterialResult.status === 'fulfilled')
        _bodyMaterials.value = bodyMaterialResult.value.map((bm) => BodyMaterialMapper.dtoToView(bm));

      if (repairTypeResult.status === 'fulfilled')
        _repairTypes.value = repairTypeResult.value.map((rt) => RepairTypeMapper.dtoToView(rt));

      if (priceParamsResult.status === 'fulfilled')
        _priceParams.value = SettingPriceMapper.dtoToView(priceParamsResult.value);
      
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };
  // #endregion

  // #region -> METHODS
  // const selectBodyPart = (lineId: number, bodyPart: BodyPartViewModel) => {
  //   const line = _lines.value.find(l => l.lineId === lineId);

  //   if (!line)
  //     return; // Sécurité : éviter les erreurs si la ligne n'existe pas

  //   line.bodyPart = bodyPart;
  //   // computePrice(line.lineId);
  // };

  // const selectBodyMaterial = (lineId: number, bodyMaterial: BodyMaterialViewModel) => {
  //   const line = _lines.value.find(l => l.lineId === lineId);

  //   if (!line)
  //     return; // Sécurité : éviter les erreurs si la ligne n'existe pas

  //   line.bodyMaterial = bodyMaterial;
  //   // computePrice(line.lineId);
  // };

  // const selectRepairType = (lineId: number, repairType: DentRepairTypeViewModel) => {
  //   const line = _lines.value.find(l => l.lineId === lineId);

  //   if (!line)
  //     return; // Sécurité : éviter les erreurs si la ligne n'existe pas

  //   line.repairType = repairType;
  //   // computePrice(line.lineId);
  // };

  // const setDentRemovalPrice = (lineId: number, dentRemovalPrice: number) => {
  //   const line = _lines.value.find(l => l.lineId === lineId);

  //   if (!line)
  //     return; // Sécurité : éviter les erreurs si la ligne n'existe pas

  //   line.dentRemovalPrice = dentRemovalPrice;
  //   // computePrice(line.lineId);
  // }
  // #endregion


  return {
    loading,
    error,
    init,

    bodyMaterials: computed(() => _bodyMaterials.value),
    repairTypes: computed(() => _repairTypes.value),

    // selectBodyPart,
    // selectBodyMaterial,
    // selectRepairType,
    // setDentRemovalPrice,
  };
}
