//TODO: (GCE) -> Not used, to remove it or use it in Ioc container

import { IBodyPartUseCase } from '@/@application/useCases/interfaces/carRepair/IBodyPartUseCase';
import { BodyPartViewModel } from '@/@presentation/types/models/carRepair/BodyPartViewModel';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { ref } from 'vue';

const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
const bodyParts = ref<BodyPartViewModel[]>([]);
const loading = ref<boolean>(false);
const error = ref(null);
export function useBodyPartState() {

  const getBodyParts = async () => {
    loading.value = true;
    try {
      bodyParts.value = await bodyPartUseCase.executeGetAll();
    } catch (e) {
      // error.value = e;
    } finally {
      loading.value = false;
    }
  };

  return {
    bodyParts,
    loading,
    error,
    getBodyParts
  };
}