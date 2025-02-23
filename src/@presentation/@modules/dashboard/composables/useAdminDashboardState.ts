import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { SupabaseClient } from '@/@infrastructure/database/clients/SupabaseClient';
import { IClientProvider } from '@/@infrastructure/interfaces/IClientProvider';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { computed, ref } from 'vue';

export function useAdminDashboardState() {
  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
  const clientProvider = container.get<IClientProvider<SupabaseClient>>(SYMBOLS.Providers.ClientProvider);
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
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;
      console.log('usersCount', usersCount);
      
      totalUsers.value = usersCount ?? 0;

      // Récupérer le nombre total de garages
      const { count: garagesCount, error: garagesError } = await supabase
        .from('car_repair.garages')
        .select('*', { count: 'exact', head: true });

      if (garagesError) throw garagesError;
      totalGarages.value = garagesCount ?? 0;

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
