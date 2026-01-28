
import { useLogin } from './auth/useLogin';
import { useRegister } from './auth/useRegister';
import { useLogout } from './auth/useLogout';

export const useAuthOperations = (
  setUser: (user: any) => void
) => {
  const { login } = useLogin();
  const { register } = useRegister();
  const { logout } = useLogout(setUser);

  return { login, register, logout };
};
