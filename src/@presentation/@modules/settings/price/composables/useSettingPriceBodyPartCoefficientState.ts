import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IBodyPartUseCase } from '@/@domain/useCases/carRepair/IBodyPartUseCase';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { BodyPartMapper } from '@/@presentation/mappers/settings/BodyPartMapper';
import { SettingPriceBodyPartCoefficientMapper } from '@/@presentation/mappers/settings/price/SettingPriceBodyPartCoefficientMapper';
import { IUseSettingPriceBodyPartCoefficientState } from '@/@presentation/types/composables/settings/price/IUseSettingPriceBodyPartCoefficientState';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { SettingPriceBodyPartCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel';
import { computed, ref } from 'vue';

export function useSettingPriceBodyPartCoefficientState(): IUseSettingPriceBodyPartCoefficientState {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const useCase = container.get<ISettingPriceBodyPartCoefficientUseCase>(
    SYMBOLS.UseCases.Setting.Price.BodyPartCoefficientUseCase
  );
  const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
  const _bodyParts = ref<BodyPartViewModel[]>([]);
  const _settings = ref<SettingPriceBodyPartCoefficientViewModel[]>([]);

  const loading = ref<boolean>(false);
  const error = ref<unknown>(null);

  const init = async () => {
    fetchBodyParts().then(() => {
      return;
    });

    return fetchSettings().then(() => {
      return;
    });
  };

  const fetchBodyParts = async (): Promise<BodyPartViewModel[]> => {
    loading.value = true;
    try {
      return bodyPartUseCase.executeGetAll().then((data) => {
        const viewModels = data.map((bp) => BodyPartMapper.dtoToView(bp));
        _bodyParts.value = viewModels;
        
        return viewModels;
      });
    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const fetchSettings = async (): Promise<SettingPriceBodyPartCoefficientViewModel[]> => {
    loading.value = true;
    try {
      if (!authState.userContext.value?.id) throw new Error('User does not exist');

      return useCase.getByUserId(authState.userContext.value?.id).then((dtos) => {    
            
        if (!dtos.length) {
          useCase.getAdmin().then((adminDtos) => {         
            _settings.value = adminDtos.map((dto) => {
              const viewModel = SettingPriceBodyPartCoefficientMapper.dtoToView(dto);
              return {
                ...viewModel,
                id: undefined,
                userId: authState.userContext.value?.id ?? ''
              }
            })
            
            return _settings.value;
          })

          return _settings.value
        }
        _settings.value = dtos.map(SettingPriceBodyPartCoefficientMapper.dtoToView);
        return _settings.value;
      });

    } catch (e) {
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const saveSettingBodyPartCoefficient = async () => {
    loading.value = true;
    try {
      const dtos = _settings.value.map(SettingPriceBodyPartCoefficientMapper.viewToDto);
      return useCase.save(dtos).then(savedDtos => {
        _settings.value = savedDtos.map(SettingPriceBodyPartCoefficientMapper.dtoToView);
      })
    } catch (e) {
      error.value = e;
      // throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    settings: computed(() => _settings.value),
    loading,
    error,
    init,
    saveSettingBodyPartCoefficient
  };
}
