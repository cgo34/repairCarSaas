import { getSelectedMemberId } from '@/features/technicians/presentation/utils/memberSelection';
import { NavigationGuard } from 'vue-router';

// The selected member lives in localStorage. Without one, go back to the list.
export const memberDetailGuard: NavigationGuard = () => {
  if (!getSelectedMemberId()) return { path: '/organization/members', replace: true };
  return true;
};
