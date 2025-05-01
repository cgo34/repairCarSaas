// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IBodyMaterialUseCase } from '@/@domain/useCases/carRepair/IBodyMaterialUseCase';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/@domain/useCases/carRepair/IDentRepairTypeUseCase';
import { ICalculateLineCostUseCase } from '@/@domain/useCases/cost/ICalculateLineCostUseCase';
import { IAddQuoteLineItemUseCase } from '@/@domain/useCases/quotes/IAddQuoteLineItemUseCase';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { LineItemMapper } from '@/@presentation/mappers/LineItemMapper';
import { BodyMaterialMapper } from '@/@presentation/mappers/settings/BodyMaterialMapper';
import { BodyPartMapper } from '@/@presentation/mappers/settings/BodyPartMapper';
import { RepairTypeMapper } from '@/@presentation/mappers/settings/RepairTypeMapper';
import { SettingPriceMapper } from '@/@presentation/mappers/settings/price/SettingPriceMapper';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';
import { computed, ref } from 'vue';
// endregion

export function useLineItemState() {
  // #region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

  const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
  const bodyMaterialUseCase = container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase);
  const repairTypeUseCase = container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase);

  const priceParamsUseCase = container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase);

  const calculateLineCostUseCase = container.get<ICalculateLineCostUseCase>(SYMBOLS.UseCases.CostCalculator.CalculateLineCostUseCase);
  const addQuoteDetailsUseCase = container.get<IAddQuoteLineItemUseCase>(SYMBOLS.UseCases.Quote.AddLineItemUseCase);
  // #endregion

  // #region -> CONSTANTS
  let LINE_ITEM_INCREMENT = 1;
  // #endregion

  // #region -> REFS
  const _viewType = ref<'form' | 'view'>('form');
  const _priceParams = ref<SettingPriceViewModel>();
  
  const _bodyParts = ref<BodyPartViewModel[]>([]);
  const _bodyMaterials = ref<BodyMaterialViewModel[]>([]);
  const _repairTypes = ref<DentRepairTypeViewModel[]>([]);

  const _lines = ref<LineItemViewModel[]>([]);
  const _quoteId = ref<string>('');

  const loading = ref(false);
  const error = ref(undefined);
// #endregion

  // #region -> INIT
  const init = async () => {
    loading.value = true;
    try {
      if (!authState.user.value)
        throw new Error('User not found');

      // resetQuote();
      // _quoteId.value = id;     
      console.log('init add line item modal');
      

      const [bodyPartData, bodyMaterialData, repairTypeData, priceParamsData] =
        await Promise.all([
          bodyPartUseCase.executeGetAll(),
          bodyMaterialUseCase.executeGetAll(),
          repairTypeUseCase.executeGetAll(),
          priceParamsUseCase.getByUserId(authState.user.value?.id),
        ]);

      _bodyParts.value = bodyPartData.map((bp) => BodyPartMapper.dtoToView(bp));
      _bodyMaterials.value = bodyMaterialData.map((bm) => BodyMaterialMapper.dtoToView(bm));
      _repairTypes.value = repairTypeData.map((rt) => RepairTypeMapper.dtoToView(rt));
      _priceParams.value = SettingPriceMapper.dtoToView(priceParamsData);
      
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };
  // #endregion

  // #region -> METHODS
  const selectBodyPart = (lineId: number, bodyPart: BodyPartViewModel) => {
    const line = _lines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.bodyPart = bodyPart;
    // computePrice(line.lineId);
  };

  const selectBodyMaterial = (lineId: number, bodyMaterial: BodyMaterialViewModel) => {
    const line = _lines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.bodyMaterial = bodyMaterial;
    // computePrice(line.lineId);
  };

  const selectRepairType = (lineId: number, repairType: DentRepairTypeViewModel) => {
    const line = _lines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.repairType = repairType;
    // computePrice(line.lineId);
  };

  const setDentRemovalPrice = (lineId: number, dentRemovalPrice: number) => {
    const line = _lines.value.find(l => l.lineId === lineId);

    if (!line)
      return; // Sécurité : éviter les erreurs si la ligne n'existe pas

    line.dentRemovalPrice = dentRemovalPrice;
    // computePrice(line.lineId);
  }

  const computePrice = (lineId: number) => {
    const line = _lines.value.find(l => l.lineId === lineId);

    if (!line || !_priceParams.value)
      throw new Error('Price params not found');

    if (!line.bodyPart || !line.bodyMaterial || !line.repairType || !line.impactCount25 || !line.impactCount35)
      return;

    const lineItemViewDto = LineItemMapper.viewToDto(line);
    // line.price = calculateLineCostUseCase.execute(lineItemViewDto, SettingPriceMapper.viewToDto(_priceParams.value));
  }
  // #endregion

  // #region -> COMPUTED
  // Liste des bodyParts restants (non sélectionnés)
  const availableBodyParts = computed(() => {
    const selectedIds = new Set(_lines.value.map((line) => {
      return line.bodyPart?.id;
      
    }));
    return _bodyParts.value.filter((bp) => !selectedIds.has(bp.id));
  });
  // #endregion

  return {
    loading,
    error,
    init,

    bodyParts: computed(() => _bodyParts.value),
    bodyMaterials: computed(() => _bodyMaterials.value),
    repairTypes: computed(() => _repairTypes.value),
    availableBodyParts,
    selectBodyPart,
    selectBodyMaterial,
    selectRepairType,
    setDentRemovalPrice,

    quoteLines: computed(() => _lines.value)
  };
}
