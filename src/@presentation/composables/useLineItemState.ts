// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { IDentRepairTypeUseCase } from '@/@domain/useCases/carRepair/IDentRepairTypeUseCase';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { BodyMaterialMapper } from '@/@presentation/mappers/settings/BodyMaterialMapper';
import { RepairTypeMapper } from '@/@presentation/mappers/settings/RepairTypeMapper';
import { SettingPriceMapper } from '@/@presentation/mappers/settings/price/SettingPriceMapper';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';
import { computed, ref } from 'vue';
// endregion

export function useLineItemState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

  const bodyMaterialUseCase = container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase);
  const repairTypeUseCase = container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase);

  const priceParamsUseCase = container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase);
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
  const error = ref(undefined);
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
          priceParamsUseCase.getByorganizationId(authState.userContext.value?.organization.id),
        ]);

      if (bodyMaterialResult.status === 'fulfilled')
        _bodyMaterials.value = bodyMaterialResult.value.map((bm) => BodyMaterialMapper.dtoToView(bm));

      if (repairTypeResult.status === 'fulfilled')
        _repairTypes.value = repairTypeResult.value.map((rt) => RepairTypeMapper.dtoToView(rt));

      if (priceParamsResult.status === 'fulfilled')
        _priceParams.value = SettingPriceMapper.dtoToView(priceParamsResult.value);
      
    } catch (e: any) {
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
