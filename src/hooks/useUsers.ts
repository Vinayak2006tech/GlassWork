import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

export const USER_KEYS = {
  all: ['users'] as const,
  detail: (id: string) => ['users', id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: USER_KEYS.all,
    queryFn: () => userService.getUsers(),
  });
}

export function useUser(id?: string) {
  return useQuery({
    queryKey: id ? USER_KEYS.detail(id) : ['users', 'unknown'],
    queryFn: () => {
      if (!id) throw new Error('User ID is required');
      return userService.getUserById(id);
    },
    enabled: Boolean(id),
  });
}
