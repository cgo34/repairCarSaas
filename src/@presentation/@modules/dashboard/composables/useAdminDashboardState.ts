import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { IGarageUseCase } from '@/@application/useCases/interfaces/IGarageUseCase';
import { IUserUseCase } from '@/@application/useCases/interfaces/IUserUseCase';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { computed, ref } from 'vue';

export function useAdminDashboardState() {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const clientProvider = container.get<IClientProvider<SupabaseClient>>(SYMBOLS.Providers.ClientProvider);
  const garageUseCase = container.get<IGarageUseCase>(SYMBOLS.UseCases.Garage);
  const userUseCase = container.get<IUserUseCase>(SYMBOLS.UseCases.UserUseCase);
  const supabase = clientProvider.getClient();

  // Références réactives pour stocker les statistiques
  const totalUsers = ref<number>(0);
  const totalGarages = ref<number>(0);
  const loading = ref<boolean>(true);
  const error = ref<unknown>(null);

  const fetchDashboardStats = async () => {
    loading.value = true;
    try {
      // Récupérer le nombre total d'utilisateurs
      // const { data: users, error } = await supabase
      //   .from('users')
      //   .select('*', { count: 'exact', head: true });

      // if (error) throw error;
      // console.log('usersCount', users);
      
      // Récupérer le nombre total de garages
      const garagesCount = await garageUseCase.getGarages().then((garages) => garages.length);

      // if (garagesError) throw garagesError;
      totalGarages.value = garagesCount ?? 0;

      const usersCount = await userUseCase.getUsers().then((users) => users.length);
      
      totalUsers.value = usersCount ?? 0;


    } catch (e) {
      error.value = e;
      console.error('Error fetching dashboard stats:', e);
    } finally {
      loading.value = false;
    }
  };

  return {
    totalUsers: computed(() => totalUsers.value),
    totalGarages: computed(() => totalGarages.value),
    loading,
    error,
    fetchDashboardStats,
  };
}
