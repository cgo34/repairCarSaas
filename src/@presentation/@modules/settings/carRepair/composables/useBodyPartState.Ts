import { IBodyPartUseCase } from '@domain/useCases/carRepair/IBodyPartUseCase';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';
import { ref } from 'vue';

const bodyPartUseCase = container.get<IBodyPartUseCase>(SYMBOLS.UseCases.CarRepair.BodyPartUseCase);
const bodyParts = ref([]);
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