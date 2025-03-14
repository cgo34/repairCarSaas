// region -> IMPORTS
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@application/useCases/interfaces/IGarageUseCase';
import { IUserUseCase } from '@/@application/useCases/interfaces/IUserUseCase';
import { IBodyMaterialUseCase } from '@/@application/useCases/interfaces/carRepair/IBodyMaterialUseCase';
import { IBodyPartUseCase } from '@/@application/useCases/interfaces/carRepair/IBodyPartUseCase';
import { IDentRepairTypeUseCase } from '@/@application/useCases/interfaces/carRepair/IDentRepairTypeUseCase';
import { ISettingPriceUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { BodyMaterialMapper } from '@/@presentation/mappers/settings/BodyMaterialMapper';
import { BodyPartMapper } from '@/@presentation/mappers/settings/BodyPartMapper';
import { RepairTypeMapper } from '@/@presentation/mappers/settings/RepairTypeMapper';
import { SettingPriceMapper } from '@/@presentation/mappers/settings/price/SettingPriceMapper';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { LineItemViewModel } from '@/@presentation/types/models/LineItemViewModel';
import { UserViewModel } from '@/@presentation/types/models/UserViewModel';
import { BodyMaterialViewModel } from '@/@presentation/types/models/carRepair/BodyMaterialViewModel';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { DentRepairTypeViewModel } from '@/@presentation/types/models/carRepair/DentRepairTypeViewModel';
import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';
import { computed, ref } from 'vue';
// endregion

export function useCreateQuoteState() {
  // region -> DEPENDENCIES
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  const technicianUseCase = container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase);
  const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
  const bodyMaterialUseCase = container.get<IBodyMaterialUseCase>(SYMBOLS.UseCases.CarRepair.BodyMaterialUseCase);
  const repairTypeUseCase = container.get<IDentRepairTypeUseCase>(SYMBOLS.UseCases.CarRepair.DentRepairTypeUseCase);
  const priceParamsUseCase = container.get<ISettingPriceUseCase>(SYMBOLS.UseCases.Setting.Price.AllUseCase);
  // endregion

  // region -> REFS
  const _garages = ref<GarageViewModel[]>([]);
  const _technicians = ref<UserViewModel[]>([]);
  const _bodyParts = ref<BodyPartViewModel[]>([]);
  const _bodyMaterials = ref<BodyMaterialViewModel[]>([]);
  const _repairTypes = ref<DentRepairTypeViewModel[]>([]);
  const _priceParams = ref<SettingPriceViewModel>();
  const _selectedTechnician = ref<UserViewModel>();
  const _selectedGarage = ref<GarageViewModel>();

  const _quoteLines = ref<LineItemViewModel[]>([]);

  const loading = ref(false);
  const error = ref(null);
// endregion

  // region -> INIT
  const init = async () => {
    loading.value = true;
    try {
      if (!authState.user.value)
        throw new Error('User not found');

      resetQuote();

      const [garageData, technicianData, bodyPartData, bodyMaterialData, repairTypeData, priceParamsData] =
        await Promise.all([
          garageUseCase.getByUserId(authState.user.value?.id),
          technicianUseCase.getUsers(),
          bodyPartUseCase.executeGetAll(),
          bodyMaterialUseCase.executeGetAll(),
          repairTypeUseCase.executeGetAll(),
          priceParamsUseCase.getByUserId(authState.user.value?.id),
        ]);

      _garages.value = garageData.map((g) => GarageMapper.dtoToView(g));
      _technicians.value = [
        ...technicianData,
        
          {
            id: '1',
            fullName: 'John Doe',
            email: 'technicien1@gmail.com',
            password: '123456789',
            createdAt: '2021-09-01T00:00:00',
          },
          {
            id: '2',
            fullName: 'Albert Dupont',
            email: 'technicien2@gmail.com',
            password: '123456789',
            createdAt: '2021-09-01T00:00:00',
          },
      ];
      _bodyParts.value = bodyPartData.map((bp) => BodyPartMapper.dtoToView(bp));
      _bodyMaterials.value = bodyMaterialData.map((bm) => BodyMaterialMapper.dtoToView(bm));
      _repairTypes.value = repairTypeData.map((rt) => RepairTypeMapper.dtoToView(rt));
      _priceParams.value = SettingPriceMapper.dtoToView(priceParamsData);

      console.log('load setting price', _priceParams.value);
      console.log('load garages', _garages.value);
      console.log('load technicians', _technicians.value);
      console.log('load bodyParts', _bodyParts.value);
      console.log('load bodyMaterials', _bodyMaterials.value);
      console.log('load repairTypes', _repairTypes.value);
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };
  // endregion

  // #region -> METHODS

  const resetQuote = () => {
    _selectedTechnician.value = null;
    _selectedGarage.value = null;
  };

  const selectTechnician = (technician: UserViewModel) => {
    _selectedTechnician.value = technician;
  }

  const selectGarage = (garage: GarageViewModel) => {
    _selectedGarage.value = garage;
  }

  // Liste des bodyParts restants (non sélectionnés)
  const availableBodyParts = computed(() => {
    const selectedIds = new Set(_quoteLines.value.map((line) => {
      console.log('line', line);
      return line.bodyPart?.id;
      
    }));
    return _bodyParts.value.filter((bp) => !selectedIds.has(bp.id));
  });

  const addLine = () => {
    console.log('addLine');
    console.log('quoteLines', _quoteLines.value);
    
    
    _quoteLines.value.push({ 
      id: Date.now(), 
      bodyPart: undefined, 
      impactCount25: undefined,
      impactCount35: undefined,
      bodyMaterial: undefined, 
      repairType: undefined,
      strippingPercentage: undefined,
      lineItemType: 'quote'
    });
    console.log('quoteLines after add', _quoteLines.value);
    
  }

  const selectBodyPart = (lineId: number, bodyPart: BodyPartViewModel) => {
    console.log('selectBodyPart', lineId, bodyPart);
  
    // Trouver la ligne concernée
    const line = _quoteLines.value.find(l => l.id === lineId);
    if (!line) return; // Sécurité : éviter les erreurs si la ligne n'existe pas
  
    // Créer une nouvelle instance pour garantir la réactivité
    Object.assign(line, { bodyPart });
  };
  
  
  
  // #endregion

  return {
    garages: computed(() => _garages.value),
    technicians: computed(() => _technicians.value),
    bodyParts: computed(() => _bodyParts.value),
    availableBodyParts,
    bodyMaterials: computed(() => _bodyMaterials.value),
    repairTypes: computed(() => _repairTypes.value),
    priceParams: computed(() => _priceParams.value),

    selectedTechnician: computed(() => _selectedTechnician.value),
    selectedGarage: computed(() => _selectedGarage.value),

    selectTechnician,
    selectGarage,
    
    quoteLines: computed(() => _quoteLines.value),
    addLine,

    selectBodyPart,

    loading,
    error,
    init,
  };
}
